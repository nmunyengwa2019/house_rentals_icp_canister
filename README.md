# message_board

### This is the updated version of the DACADE course starter example, using the latest version of Azle cdk with updated syntax for typescript canister development.

This example project will help you to deploy your first canister (application) to the Internet Computer (IC) decentralized cloud. It is a simple getter/setter canister. You can always refer to [The Azle Book](https://demergent-labs.github.io/azle/) for more in-depth documentation.

## Prerequisites

- Follow these instructions from the Azle Book to [install all the required tools and set up your environment](https://demergent-labs.github.io/azle/installation.html).

Clone this repository and navigate to the `message_board` directory:

```bash
git clone https://github.com/mzansiweb3-icp-hub/message_board.git
cd message_board
```

## Install dependencies

```bash
npm install
```

Deploy the canister locally:

```bash
dfx deploy
```

You should see something like this:

```bash
Deploying all canisters.
All canisters have already been created.
Building canisters...
Executing 'npx azle message_board'

Building canister message_board

Done in 18.76s

🎉 Built canister message_board at .azle/message_board/message_board.wasm

Installing canisters...
Module hash e60c6f97fcb9495a4074e7f272ebced71e5dc32dd6c5df6c2103852cd0855db9 is already installed.
Deployed canisters.
URLs:
  Backend canister via Candid interface:
    message_board: http://127.0.0.1:4943/?canisterId=b77ix-eeaaa-aaaaa-qaada-cai&id=bw4dl-smaaa-aaaaa-qaacq-cai

```bash

## Interact with the canister

You can now interact with the canister using the the candid interface URL provided in the output above.

