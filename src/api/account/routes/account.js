'use strict';

/**
 * account router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::account.account');

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/v1/accounts',
            handler: 'api::account.account.find',
        },
        {
            method: 'GET',
            path: '/v1/accounts/:id',
            handler: 'api::account.account.findOne',
        },
        {
            method: 'POST',
            path: '/v1/accounts',
            handler: 'api::account.account.create',
        },
        {
            method: 'PUT',
            path: '/v1/accounts/:id',
            handler: 'api::account.account.update',
        },
        {
            method: 'DELETE',
            path: '/v1/accounts/:id',
            handler: 'api::account.account.delete',
        },
        {
            method: 'POST',
            path: '/v1/accounts/auth',
            handler: 'api::account.account.login',
        },
        {
            method: "DELETE",
            path: '/v1/accounts/:id/photo-profile',
            handler: 'api::account.account.deletePhotoProfile',
        },
    ],
};