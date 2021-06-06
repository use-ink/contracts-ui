import React, {useEffect, useState} from 'react'
import { ApiPromise, WsProvider } from '@polkadot/api';
async function main() {
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });
  return api.genesisHash.toHex();
}
export default function Homepage() {
  main().then((hex) => console.log(hex)).catch(err => console.log(err))
  return (
    <div>
      <h1>Hello</h1>
    </div>
  )
}
