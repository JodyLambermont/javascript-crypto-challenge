const _sodium = require('libsodium-wrappers');

var rx = null;
var tx = null;

// Variable name starting with c stands for client and starting with s stands for server
// Had to rename due to ambiguity in function naming

// clientPublicKey
var cPublicKey = null;
// clientPrivateKey
var cPrivateKey = null;
// serverPrivateKey
var sPublicKey = null;

module.exports.setClientPublicKey = function setClientPublicKey(key)
{
    // Check if the key is already set
    if (cPublicKey === key)
    {
        return;
    }

    // Disable the ability to modify the clientPublicKey
    if ((cPublicKey !== null) && (cPublicKey !== key))
    {
        throw 'client public key already set';
    }

    cPublicKey = key;

    // Generate clientPrivateKey and ServerPublicKey
    const keypair = _sodium.crypto_kx_keypair();
    cPrivateKey = keypair.privateKey ;
    sPublicKey = keypair.publicKey;

    // Generate shared keys
    sharedkeys = _sodium.crypto_kx_server_session_keys(sPublicKey,cPrivateKey, key);

    // Set rx and tx
    rx = sharedkeys.sharedRx;
    tx = sharedkeys.sharedTx;
}

module.exports.serverPublicKey = async function serverPublicKey()
{
    // Await sodium to be ready
    await _sodium.ready;

    // Returning the serverPublicKey
    return sPublicKey;

}

module.exports.encrypt = async function encrypt(msg)
{
    // Await sodium to be ready
    await _sodium.ready;

    // Generate a cypher and encrypt the message
    nonce = _sodium.randombytes_buf(_sodium.crypto_secretbox_NONCEBYTES)
    ciphertext = _sodium.crypto_secretbox_easy(msg, nonce, tx)

    return {ciphertext, nonce};
}

module.exports.decrypt = async function(ciphertext, nonce)
{
        // Await sodium to be ready
        await _sodium.ready;

        // Await and decrypt the message with the given ciphertext and nonce
        return await _sodium.crypto_secretbox_open_easy(ciphertext, nonce, rx);
}