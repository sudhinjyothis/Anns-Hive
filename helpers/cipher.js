const crypto = require('crypto');
require('dotenv').config()
const algorithm = 'aes-256-ctr';
const secretKey = process.env.ENCRYPTION_KEY;
let encryptionkey = crypto.createHash('sha256').update(String(secretKey)).digest('base64').substr(0, 32);
const iv = crypto.randomBytes(16);
// encrypting given string
const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, encryptionkey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    const hash = iv.toString('hex') + "." + encrypted.toString('hex')
    return hash
};
// decrypting given hash
const decrypt = (hash) => {
    hash = hash.split(".")
    const decipher = crypto.createDecipheriv(algorithm, encryptionkey, Buffer.from(hash[0], 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash[1], 'hex')), decipher.final()]);
    return decrpyted.toString();
};
module.exports = {
    encrypt,
    decrypt
};