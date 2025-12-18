const openpgp = require("openpgp");
const fs = require("fs");

generate();
async function generate() {
  const { privateKey, publicKey }  = await openpgp.generateKey({
    type: 'ecc',  //curve: 'curve25519',
    curve: 'curve25519', //rsaBits: 4096,
    userIDs: [{ name: "Briella", email: "briellat029@gmail.com" }],
    passphrase: "password123",
    format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
  });
  fs.writeFileSync("./private-Brie.key", privateKey);
  fs.writeFileSync("./public-Brie.key", publicKey);
  console.log(`keys generated and written to file...`);
}