const queryString = require('querystring');

module.exports = {
  body(request) {
    return new Promise((resolve, reject) => {
      let post = '';
      request.on('data', data => {
        post += data;
      });
      request.on('end', () => {
        resolve(queryString.parse(post));
      });
    });
  }
};



