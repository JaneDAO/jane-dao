## Deployment Notes

```
$ DEPLOY=1 npx hardhat run scripts/deployToken.js --network goerli
Deployer account is 0xC1151bb68d67dD5CD992b8dB8e7221588F79F617
Deploying Token...
Token Jane DAO Token/JANE deployed to 0x6A4ec3EEE5131163f457A26cb4Ed78ce23432b63. First holder 0x6e35D16AeF101d8c1167EE83Ea7f3A90c91c898d
```

```
$ DEPLOY=1 npx hardhat run scripts/deployDAO.js --network goerli
Deployer account is 0xC1151bb68d67dD5CD992b8dB8e7221588F79F617
Deploying Timelock...
Timelock deployed to 0xD45a6a8A187ec7f1E9b1E275Ca1EccAc98731552
Deploying DAO...
DAO Jane DAO Governor deployed to 0x16B6def9fAae7C1b1218Da97CFf0767de86a15ee
Configuring Timelock...
Timelock configured
Configuring Upgrades...
✔ 0x6A4ec3EEE5131163f457A26cb4Ed78ce23432b63 (transparent) proxy ownership transfered through admin proxy
✔ 0x16B6def9fAae7C1b1218Da97CFf0767de86a15ee (transparent) proxy ownership transfered through admin proxy
Upgrades configured
```

Verification
---
```
$ npm run recompile 

> jane-dao@1.0.0 recompile /home/aaron/dev/projects/marc/jane-dao
> npx hardhat clean && npx hardhat compile

Compiled 70 Solidity files successfully
$ VERIFY=1 npx hardhat verify --network goerli 0x16B6def9fAae7C1b1218Da97CFf0767de86a15ee
Verifying implementation: 0xf9389d35a9bbf50B857f227C346A67ea6FDC2CC4
Nothing to compile
Successfully submitted source code for contract
contracts/DAO.sol:DAO at 0xf9389d35a9bbf50B857f227C346A67ea6FDC2CC4
for verification on the block explorer. Waiting for verification result...

Successfully verified contract DAO on Etherscan.
https://goerli.etherscan.io/address/0xf9389d35a9bbf50B857f227C346A67ea6FDC2CC4#code
Verifying proxy: 0x16B6def9fAae7C1b1218Da97CFf0767de86a15ee
Contract at 0x16B6def9fAae7C1b1218Da97CFf0767de86a15ee already verified.
Linking proxy 0x16B6def9fAae7C1b1218Da97CFf0767de86a15ee with implementation
Successfully linked proxy to implementation.
Verifying proxy admin: 0x03FdbeeDB63E7D29bE5BAc95af341683ACA05718
Contract at 0x03FdbeeDB63E7D29bE5BAc95af341683ACA05718 already verified.

Proxy fully verified.

$ VERIFY=1 npx hardhat verify --network goerli 0x6A4ec3EEE5131163f457A26cb4Ed78ce23432b63
Verifying implementation: 0x9221651108449cF5FFCCf0b6F0013312D3279579
Nothing to compile
Successfully submitted source code for contract
contracts/Token.sol:Token at 0x9221651108449cF5FFCCf0b6F0013312D3279579
for verification on the block explorer. Waiting for verification result...

Successfully verified contract Token on Etherscan.
https://goerli.etherscan.io/address/0x9221651108449cF5FFCCf0b6F0013312D3279579#code
Verifying proxy: 0x6A4ec3EEE5131163f457A26cb4Ed78ce23432b63
Contract at 0x6A4ec3EEE5131163f457A26cb4Ed78ce23432b63 already verified.
Linking proxy 0x6A4ec3EEE5131163f457A26cb4Ed78ce23432b63 with implementation
Successfully linked proxy to implementation.
Verifying proxy admin: 0x03FdbeeDB63E7D29bE5BAc95af341683ACA05718
Contract at 0x03FdbeeDB63E7D29bE5BAc95af341683ACA05718 already verified.

Proxy fully verified.
```