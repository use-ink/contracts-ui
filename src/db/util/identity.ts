// Copyright 2021 @paritytech/canvas-ui-v2 authors & contributors

import { keccakAsU8a } from '@polkadot/util-crypto';
import { PrivateKey } from '@textile/crypto';
import { hashSync } from 'bcryptjs';
import { KeyringPair } from 'types';

const USER_IDENTITY_KEY = 'user-identity';

export function publicKeyHex(identity?: PrivateKey | null): string | undefined {
  return identity ? Buffer.from(identity.pubKey).toString('hex') : undefined;
}

export function getPrivateKeyRandom(): PrivateKey {
  return PrivateKey.fromRandom();
}

export function getStoredPrivateKey(): PrivateKey {
  let idStr = window?.localStorage.getItem(USER_IDENTITY_KEY);

  if (idStr) {
    return PrivateKey.fromString(idStr);
  } else {
    const id = getPrivateKeyRandom();

    idStr = id.toString();
    window.localStorage.setItem(USER_IDENTITY_KEY, idStr);

    return id;
  }
}

function generateMessageForEntropy (pair: KeyringPair, applicationName: string, secret: string): string {
  return `${'********************************************************************************'}
    ${'READ THIS MESSAGE CAREFULLY.'}
    ${'DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND WRITE'}
    ${'ACCESS TO THIS APPLICATION.'}
    ${'DO NOT SIGN THIS MESSAGE IF THE FOLLOWING IS NOT TRUE OR YOU DO NOT CONSENT'}
    ${'TO THE CURRENT APPLICATION HAVING ACCESS TO THE FOLLOWING APPLICATION.'}
    ${'********************************************************************************'}
    ${'The Polkadot address used by this application is:'}
    ${''}
    ${pair.address}
    ${''}
    ${''}
    ${''}
    ${'By signing this message, you authorize the current application to use the'}
    ${'following app associated with the above address:'}
    ${''}
    ${applicationName}
    ${''}
    ${''}
    ${''}
    ${'The hash of your non-recoverable, private, non-persisted password or secret'}
    ${'phrase is:'}
    ${''}
    ${secret}
    ${''}
    ${''}
    ${''}
    ${'********************************************************************************'}
    ${'ONLY SIGN THIS MESSAGE IF YOU CONSENT TO THE CURRENT PAGE ACCESSING THE KEYS'}
    ${'ASSOCIATED WITH THE ABOVE ADDRESS AND APPLICATION.'}
    ${'AGAIN, DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND'}
    ${'WRITE ACCESS TO THIS APPLICATION.'}
    ${'********************************************************************************'}
  `;
}

export function getPrivateKeyFromPair (pair: KeyringPair, secretText = 'asdf'): PrivateKey {
  // avoid sending the raw secret by hashing it first
  const secret = hashSync(secretText, 10);
  const message = generateMessageForEntropy(pair, 'canvas-ui', secret);
  const signedText = pair.sign(message, { signer });
  const hash = keccakAsU8a(signedText);
  
  if (hash === null) {
    throw new Error('No account is provided. Please provide an account to this application.');
  }
    
  if (hash.length !== 32) {
    throw new Error('Hash of signature is not the correct size! Something went wrong!');
  }
  const identity = PrivateKey.fromRawEd25519Seed(hash)

  console.log(identity.toString())

  // Your app can now use this identity for generating a user Mailbox, Threads, Buckets, etc
  return identity
}