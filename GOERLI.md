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