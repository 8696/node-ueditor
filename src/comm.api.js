exports.makeKey = function () {
  let s = [],
    hexDigits = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  return s.join('');
};
exports.removeStrEnd = function (str) {
  return str.trim().replace(/^\//, '')
    .replace(/\/$/, '');
};
