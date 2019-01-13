const cache = require('./cache');
const commApi = require('./comm.api');
const fs = require('fs');
const fsExtra = require('fs-extra');
const path = require('path');
const glob = require('glob');
const makeDir = require('make-dir');
const formidable = require('formidable');
const parse = require('./parse');
let config = {};
let options = {};
module.exports = {
    has(path) {
        return this.action.hasOwnProperty(path);
    },
    init() {
        config = cache.get('config');
        options = cache.get('options');
    },

    async action({NativeRequest, response, next, query, send, type}) {

        switch (query.action) {
            case 'config': {
                send(response, config);
                break;
            }
            case 'uploadscrawl': {
                let body = await parse.body(NativeRequest);
                let dataBuffer = new Buffer(body.upfile, 'base64'),
                    dir = await makeDir(path.resolve(options.publicPath, options.uploadsPath + '/uploadscrawl')),
                    fileName = `${commApi.makeKey()}.png`,
                    filePath = path.resolve(dir, `./${fileName}`);
                fs.writeFileSync(filePath, dataBuffer);
                console.error(options);
                send(response, {
                    original: fileName,
                    size: 1,
                    state: 'SUCCESS',
                    title: fileName,
                    type: '.png',
                    url: filePath.replace(options.publicPath, '')
                        .replace(/\\/g, '/')
                });
                break;
            }
            case 'uploadvideo':
            case 'uploadfile':
            case 'uploadimage': {
                let dir = await makeDir(path.resolve(options.publicPath, options.uploadsPath + '/' + query.action));
                const form = new formidable.IncomingForm();
                form.uploadDir = dir;
                form.keepExtensions = true;
                let fileInfo = await (function () {
                    return new Promise((resolve, reject) => {
                        form.parse(NativeRequest, (err, fields, files) => {
                            resolve(files);
                        });
                    });
                }());
                send(response, {
                    original: fileInfo.upfile['name'],
                    size: 1,
                    state: 'SUCCESS',
                    title: fileInfo.upfile['name'],
                    type: '.png',
                    url: fileInfo.upfile['path'].replace(options.publicPath, '')
                        .replace(/\\/g, '/')
                });
                break;
            }
            case 'listimage':
            case 'listfile': {
                let filePath = path.resolve(path.resolve(options.publicPath,
                    options.uploadsPath + '/' + (query.action === 'listimage' ? 'uploadimage' : 'uploadfile'))),
                    images = [],
                    start = Number.parseInt(query.start),
                    end = start + Number.parseInt(query.size);
                let files = glob.sync(path.resolve(filePath, './*.*'));
                for (let i = 0; i < files.length; i++) {
                    if (i >= start && i < end) {
                        images.push({
                            url: path.resolve(files[i]).replace(options.publicPath, '')
                                .replace(/\\/g, '/')
                        });
                    }
                    if (i >= end) break;
                }
                send(response, {
                    list: images,
                    start,
                    state: 'SUCCESS',
                    total: files.length
                });
            }
        }
    }

};
