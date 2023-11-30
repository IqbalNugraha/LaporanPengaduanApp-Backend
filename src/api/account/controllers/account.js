'use strict';
const bcrypt = require('bcrypt');

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::account.account', ({ strapi }) => ({
    async login(ctx) {
        const requestBody = ctx.request.body;
        const { email, password } = requestBody.data;

        try {
            const account = await strapi.query('api::account.account').findOne({ where: { email } });

            if (!account) {
                ctx.status = 404;
                ctx.body = { data: { error: 'Account not found' } };
                return ctx;
            }

            const plainPassword = Array.isArray(password) ? password[0] : password;

            const passwordMatch = await bcrypt.compare(plainPassword, account.password);

            const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
                id: 1
            });

            if (passwordMatch) {
                const attributes = {
                    name: account.name,
                    no_identity: account.no_identity,
                    email: account.email,
                    phone_number: account.phone_number,
                    birth_date: account.birth_date,
                    gender: account.gender,
                    address: account.address,
                    thumbnail: account.thumbnail,
                };

                ctx.status = 200;
                ctx.body = { data: { jwt, id: account.id, attributes } };
                return ctx;
            } else {
                ctx.status = 401;
                ctx.body = { data: { error: 'Unauthorized' } };
                return ctx;
            }

        } catch (error) {
            ctx.status = 500;
            ctx.body = { data: { error: error.message } };
            return ctx;
        }
    },

    async update(ctx) {
        try {
            const { data } = ctx.request.body;
            const uploadedFile = ctx.request.files.files;
            const { id } = ctx.params;

            const parsedAttributes = JSON.parse(data);

            const account = await strapi.query('api::account.account').findOne({ where: { id } });

            if (!account) {
                ctx.status = 404;
                ctx.body = { data: { error: 'Account not found' } };
                return ctx;
            }

            if (uploadedFile) {
                const file = await strapi.plugins.upload.services.upload.upload({
                    data: {
                        refId: account.id,
                        ref: 'api::account.account',
                        field: 'thumbnails',
                        fileInfo: { filename: uploadedFile.name, mime: uploadedFile.type, size: uploadedFile.size },
                        options: {
                            versions: false,
                        },
                    },
                    files: [uploadedFile],
                });
            }

            const birthDate = new Date(parsedAttributes['birth_date']);
            const formattedBirthDate = birthDate.toISOString().split('T')[0];

            const updatedAccount = await strapi.entityService.update('api::account.account', id, {
                data: {
                    name: parsedAttributes['name'],
                    no_identity: parsedAttributes['no_identity'],
                    email: parsedAttributes['email'],
                    phone_number: parsedAttributes['phone_number'],
                    birth_date: formattedBirthDate,
                    gender: parsedAttributes['gender'],
                    address: parsedAttributes['address'],
                },
            });

            ctx.status = 200;
            ctx.body = { data: { attributes: updatedAccount } };
            return ctx;
        } catch (error) {
            ctx.status = 500;
            ctx.body = { data: { error: error.message } };
            return ctx;
        }
    },

    async deletePhotoProfile(ctx) {
        try {
            const { id } = ctx.params;

            const account = await strapi.entityService.findOne('api::account.account', id, {
                fields: ['id'],
                populate: ['thumbnails'],
            });

            if (!account) {
                ctx.status = 404;
                ctx.body = { data: { error: 'Account not found' } };
                return ctx;
            }

            if (!account.thumbnails) {
                ctx.status = 404;
                ctx.body = { data: { error: 'Photo profile not found' } };
                return ctx;
            }

            const thumbnails = account.thumbnails.id;

            const deletedPhotoProfile = await strapi.plugins.upload.services.upload.remove({ id: thumbnails });

            ctx.status = 200;
            ctx.body = { data: { attributes: { id } } };
            return ctx;
        } catch (error) {
            ctx.status = 500;
            ctx.body = { data: { error: error.message } };
            return ctx;
        }
    },
}));
