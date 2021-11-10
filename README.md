# Substrate Contracts Explorer

Substrate Contracts Explorer is a `React.js` application for testing WASM smart contracts deployment and interaction on compatible Substrate blockchains.
Currently works only with smart contracts written in [ink!](https://paritytech.github.io/ink-docs/) but should support similar smart contract languages in the near future.

In order to deploy a smart contract you have to run a local [Substrate Contracts Node](https://github.com/paritytech/substrate-contracts-node).

Support for Canvas Testnet and other smart contract chains comming soon.

This version succeeds [Canvas UI](https://paritytech.github.io/canvas-ui/#/instantiate), with the purpose of having a maintainable and well tested codebase, as well as some cool new features like user contract collections, favorites, statistics and more.

## Prerequisites

1. #### [Substrate Contracts Node](https://github.com/paritytech/substrate-contracts-node) running locally

   In order to be able to run any Substrate node locally, you need to prepare your environment according to your setup and familiarity with the Rust programming language. [This tutorial](https://docs.substrate.io/tutorials/v3/ink-workshop/pt1/#prerequisites) is a good step by step guide to get started.

2. #### Compiled ink! contract

   After installing all the prerequisites for Substrate development and the ink! CLI tool (cargo-contract), you are able to either [start a new ink! project](https://docs.substrate.io/tutorials/v3/ink-workshop/pt1/#creating-an-ink-project) or compile one of the [example smart contracts](https://github.com/paritytech/ink/tree/master/examples) by cloning the repo and running `cargo +nightly contract build` in the root folder of each example.

## Features

### Contract instantiation

Once you have a compiled contract and a local node running, you can use the hosted version of Substrate Contracts Explorer to [add a new contract on-chain](https://paritytech.github.io/substrate-contracts-explorer/#/instantiate).

There are 2 instantiation methods:

#### Upload New Contract Code

In Substrate, contract code is stored only once on-chain and shared between instances. If the contract has never been instantiated before in it's current form, you need to choose the Upload New Contract Code option and provide the `.contract` code bundle that was generated when compiling the ink! contract. The bundle contains the contract metadata and the WASM code. Make sure your versions for the node, ink! and cargo-contract are up to date, otherwise the `.contract` bundle will be invalid.

#### Use Existing Contract Code

If you need to re-instantiate a contract from a different owner or for other reasons, you can use the "Use Existing Contract Code" option. You will have to provide a code hash that already exists on-chain or choose one that was previously uploaded via our UI. If the code hash you provided was not uploaded via Substrate Contracts Explorer, you will also have to provide the `metadata.json` file in the next step.

The UI will interpret the contract metadata and provide a guided instantiation form.

### Interaction

After a successful instantiation, you will be redirected to the contract page where you can call contract messages (methods) and get a log of results.

## Run the app locally

Install dependencies

```bash
yarn
```

Run dev server

```bash
yarn start
```
