const fs = require('fs');
const path = require('path');
const cache = require('./cache');
const action = require('./action');

module.exports = (options) => {
    let defaultOptions = {};
    options = Object.assign(defaultOptions, options);
    options.serverUrl = '/' + options.serverUrl.replace(/^\//, '');
    options.uploadsPath = options.uploadsPath.replace(/^\//, '')
        .replace(/\/$/, '');

    try {
        let config = JSON.parse(fs.readFileSync(path.resolve(__dirname, './config/ueditor.json'))
            .toString().replace(/\/\*[\s\S]+?\*\//g, ''));
        cache.set('config', config);
        cache.set('options', options);
        action.init();
    } catch (e) {
        throw new Error('UEditor config file damage, please reinstall ;');
    }

    return async (a, b, c) => {
        let isKoa = c === undefined;
        if ((isKoa ? a.request.path : a.path) === options.serverUrl) {
            try {
                await action.action({
                    NativeRequest: isKoa ? a['req'] : a,
                    response: isKoa ? a.response : b,
                    next: isKoa ? b : c,
                    query: isKoa ? a.request.query : a.query,
                    send: (response, data) => {
                        typeof response.send === 'function' ? (response.send(data)) : (response.body = data);
                    },
                    type: isKoa ? 'koa' : 'express'
                });
            } catch (e) {
                let error = {
                    state: 'ERROR',
                    msg: e.toString()
                };
                if (isKoa) {
                    a.status = 500;
                    a.response.body = error;
                } else {
                    b.status(500).send(error);
                }
            }
        } else {
            isKoa ? (await b()) : (c());
        }
    };
};
