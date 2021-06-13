const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const secretKey = process.env.ENCRYPTION_KEY;
let encryptionkey = crypto.createHash('sha256').update(String(secretKey)).digest('base64').substr(0, 32);
const iv = crypto.randomBytes(16);

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, encryptionkey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    const hash = iv.toString('hex') + "." + encrypted.toString('hex')
    return hash
};

const decrypt = (hash) => {
    hash = hash.split(".")
    const decipher = crypto.createDecipheriv(algorithm, encryptionkey, Buffer.from(hash[0], 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash[1], 'hex')), decipher.final()]);
    return decrpyted.toString();
};
decrypt('97e92810a9571d4d76b3f0d6a60dbcbb.cef5efd29b7b84dcd5f8a2c73a950f60161da54d74d48ad963ccd1571994c8d544f2e423361123bf480aa4fe9bbe749fe35c80d5906461807e333742e04e5e07a85cc34afecb22ddadcf66ab4488be93e30104c5bdc86ecbaa0f7a4923f33cc9cb81140a23cf9def379376ff75dfe7c1f6c2689299cca063d349b136b68f74356168f35d8c8d5740844547343d55bfc5fc69958f5be11b65c4fcc06005cc4b49c717fdb88c8c49c7807d82b997a6bcd5d662be852ef5812ac7d4868af264eb360821d2f6f1b97c95478658d16517b4a1854a496155a001bd2dc147bab7f61e58721e4e')
module.exports = {
    encrypt,
    decrypt
};