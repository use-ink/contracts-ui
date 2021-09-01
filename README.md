# Canvas UI V2

Canvas UI v2 is a web application for smart contract deployment and interaction, but also an explorer for smart contracts created by the community, hosted on IPFS.
Currently works only with smart contracts written in ink!, but should support any kind of smart contract that compiles to WASM and provides compatible metadata.

In order to deploy a smart contract you would have to run a local [Canvas Node](https://github.com/paritytech/canvas-node).

Support for Canvas Testnet and other common good contract chains comming soon.

This v2 comes after [Canvas UI v1](https://github.com/paritytech/canvas-ui), with the purpose of having a maintainable and well tested codebase, as well as some cool new features like user contract collections, favorites, statistics and more.

## Getting Started

1. Install Substrate development environment and Canvas Node following [this tutorial](https://substrate.dev/substrate-contracts-workshop/#/0/setup)

2. Compile your ink! contract with `cargo-contract`. You can find some useful examples to start from [here](https://github.com/paritytech/ink/tree/master/examples)

3. Clone this repo, install dependencies and run the development server:

```bash
yarn start
```

4. Go to Add New Contract page and choose to instantiate with code (wip) or from existing code (done).

5. Interact with your newly deployed contract on the contract page. (wip, see the new contract address in console, go to /contracts/[addrfromconsole] to access the contract page)

## Run tests:

```bash
yarn test
```

## Run lint:

```bash
yarn lint
```

## Run dev build

```bash
yarn build
```

## Run prod build

```bash
yarn build:prod
```
