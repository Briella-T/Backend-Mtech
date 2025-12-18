//decrypt.js
const openpgp = require('openpgp');
const fs = require('fs');

const privateKeyArmored = fs.readFileSync('./public-Brie.key', 'utf-8');
const passphrase = 'mira';

(async () => {
    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored.toString() }),
        passphrase
    });

    const encryptedData = fs.readFileSync("encrypted-secret.txt");

    const decrypted = await openpgp.decrypt({
        message: await openpgp.readMessage({ armoredMessage: encryptedData.toString() }),
        decryptionKeys: [privateKey],
    });
    console.log('Successfully decrypted data...');
    console.log(decrypted.data);
})();