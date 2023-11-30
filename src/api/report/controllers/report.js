'use strict';

/**
 * report controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::report.report', ({ strapi }) => ({
    async create(ctx) {
        try {
            const requestBody = ctx.request.body;
            const { data } = requestBody;
            const uploadedFile = ctx.request.files.files;

            const parsedAttributes = JSON.parse(data);

            const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format: YYYY-MM-DD HH:mm:ss

            const report = await strapi.entityService.create('api::report.report', {
                data: {
                    name: parsedAttributes.name,
                    no_identity: parsedAttributes.no_identity,
                    phone_number: parsedAttributes.phone_number,
                    city: parsedAttributes.city,
                    province: parsedAttributes.province,
                    subdistrict: parsedAttributes.subdistrict,
                    address: parsedAttributes.address,
                    description_report: parsedAttributes.description_report,
                    no_kip: parsedAttributes.no_kip,
                    no_kks: parsedAttributes.no_kks,
                    no_bpjs: parsedAttributes.no_bpjs,
                    id_province: parsedAttributes.id_province,
                    id_city: parsedAttributes.id_city,
                    account: parsedAttributes.account,
                    publishedAt: currentTimestamp,
                },
            });
            const { id } = report;

            if (uploadedFile) {
                const file = await strapi.plugins.upload.services.upload.upload({
                    data: {
                        refId: id,
                        ref: 'api::report.report',
                        field: 'thumbnails',
                        fileInfo: { filename: uploadedFile.name, mime: uploadedFile.type, size: uploadedFile.size },
                        options: {
                            versions: false,
                        },
                    },
                    files: [uploadedFile],
                });
            }

            ctx.status = 200;
            ctx.body = { data: { report } };
            return ctx;
        } catch {
            ctx.status = 500;
            ctx.body = { data: { error: error.message } };
            return ctx;
        }
    },

    async update(ctx) {
        try {
            const requestBody = ctx.request.body;
            const { data } = requestBody;
            const uploadedFile = ctx.request.files.files;
            const { id } = ctx.params;

            const parsedAttributes = JSON.parse(data);

            const report = await strapi.entityService.findOne('api::report.report', id, {
                fields: ['id', 'name', 'no_identity', 'phone_number', 'city', 'province', 'subdistrict', 'address', 'description_report', 'no_kip', 'no_kks', 'no_bpjs', 'id_province', 'id_city'],
            });

            if (!report) {
                ctx.status = 404;
                ctx.body = { data: { error: 'Report not found' } };
                return ctx;
            }

            const updatedCertification = await strapi.entityService.update('api::report.report', id, {
                data: {
                    name: parsedAttributes.name,
                    no_identity: parsedAttributes.no_identity,
                    phone_number: parsedAttributes.phone_number,
                    city: parsedAttributes.city,
                    province: parsedAttributes.province,
                    subdistrict: parsedAttributes.subdistrict,
                    address: parsedAttributes.address,
                    description_report: parsedAttributes.description_report,
                    no_kip: parsedAttributes.no_kip,
                    no_kks: parsedAttributes.no_kks,
                    no_bpjs: parsedAttributes.no_bpjs,
                    id_province: parsedAttributes.id_province,
                    id_city: parsedAttributes.id_city,
                    account: parsedAttributes.account
                },
            });

            if (uploadedFile) {
                const file = await strapi.plugins.upload.services.upload.upload({
                    data: {
                        refId: id,
                        ref: 'api::report.report',
                        field: 'thumbnails',
                        fileInfo: { filename: uploadedFile.name, mime: uploadedFile.type, size: uploadedFile.size },
                        options: {
                            versions: false,
                        },
                    },
                    files: [uploadedFile],
                });
            }

            ctx.status = 200;
            ctx.body = { data: { certification: updatedCertification } };
            return ctx;
        } catch (error) {
            ctx.status = 500;
            ctx.body = { data: { error: error.message } };
            return ctx;
        }
    },
}));
