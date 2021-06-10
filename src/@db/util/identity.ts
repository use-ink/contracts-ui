// Copyright 2021 @paritytech/canvasui-v2 authors & contributors

import { PrivateKey } from '@textile/crypto';

const USER_IDENTITY_KEY = 'user-identity';

export function publicKeyHex(identity?: PrivateKey | null): string | undefined {
  return identity ? Buffer.from(identity.pubKey).toString('hex') : undefined;
}

export function createPrivateKey(): PrivateKey {
  return PrivateKey.fromRandom();
}

export function getStoredPrivateKey(): PrivateKey {
  let idStr = window?.localStorage.getItem(USER_IDENTITY_KEY);

  if (idStr) {
    return PrivateKey.fromString(idStr);
  } else {
    const id = createPrivateKey();

    idStr = id.toString();
    window.localStorage.setItem(USER_IDENTITY_KEY, idStr);

    return id;
  }
}