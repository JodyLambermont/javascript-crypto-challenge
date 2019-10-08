const _sodium = require('libsodium-wrappers');

var myPrivateKey = null;

// initialise the needed decryption key
module.exports.setKey = async function setKey(key)
{
    myPrivateKey = key;
}

// nonce = coined for one occasion.
// decrypt the ciphertext based off nonce and key (myPrivateKey)
module.exports.decrypt = async function decrypt(ciphertext, nonce)
{
    // small check on key, otherwise throw exception
    if (myPrivateKey === null)
    {
        // 1th test pass
        throw 'no key';
    }

    // sodium needs to be ready, hence await
    await _sodium.ready;

    // 2nd test passed - test suite decrypt.test finished
    return _sodium.crypto_secretbox_open_easy(ciphertext, nonce, myPrivateKey);
}