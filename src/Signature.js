const _sodium = require('libsodium-wrappers');

var myPrivateKey = null;

(async () => {
    
    await _sodium.ready;

    // generate a keypair - public and secret key
    myPrivateKey = _sodium.crypto_sign_keypair();
})();

// sign the message with the private key provided from the keypair
module.exports.sign = async function sign(msg)
{
    await _sodium.ready;

    return _sodium.crypto_sign(msg, myPrivateKey.privateKey);
}

// verify the keypair and return the public key
module.exports.verifyingKey = async function verifyingKey()
{
    await _sodium.ready;

    return myPrivateKey.publicKey;
}