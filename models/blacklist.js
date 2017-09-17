'use strict';

const knex = require('../lib/knex');
const dtHelpers = require('../lib/dt-helpers');
const shares = require('./shares');
const tools = require('../lib/tools-async');

async function listDTAjax(context, params) {
    shares.enforceGlobalPermission(context, 'manageBlacklist');

    return await dtHelpers.ajaxList(
        params,
        builder => builder
            .from('blacklist'),
        ['blacklist.email']
    );
}

async function add(context, email) {
    return await knex.transaction(async tx => {
        shares.enforceGlobalPermission(context, 'manageBlacklist');

        const existing = await tx('blacklist').where('email', email).first();
        if (!existing) {
            await tx('blacklist').insert({email});
        }
    });
}

async function remove(context, email) {
    shares.enforceGlobalPermission(context, 'manageBlacklist');
    await knex('blacklist').where('email', email).del();
}

async function isBlacklisted(email) {
    const existing = await knex('blacklist').where('email', email).first();
    return !!existing;
}

async function serverValidate(context, data) {
    shares.enforceGlobalPermission(context, 'manageBlacklist');
    const result = {};

    if (data.email) {
        const user = await knex('blacklist').where('email', data.email).first();

        result.email = {};
        result.email.invalid = await tools.validateEmail(data.email) !== 0;
        result.email.exists = !!user;
    }

    return result;
}

module.exports = {
    listDTAjax,
    add,
    remove,
    isBlacklisted,
    serverValidate
};