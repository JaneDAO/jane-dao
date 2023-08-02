## Deployment Notes

```
$ DEPLOY=1 npx hardhat run scripts/deployToken.js --network mainnet
Deployer account is 0x122B6caf3422a9e4D2D85A48D78Bb4b3D5748239
Deploying Token...
Token Jane DAO Token/JANE deployed to 0x157a0Adbc19Bedf5C7B2E1f14d71F781267E6821. First holder 0xCDD5EeEF20923c927EA3BFd7274088f64d3a31BD
```

```
$ DEPLOY=1 npx hardhat run scripts/deployDAO.js --network mainnet
Deployer account is 0x122B6caf3422a9e4D2D85A48D78Bb4b3D5748239
Deploying Timelock...
Timelock deployed to 0x61436342A09D9E6E616eD76B2D2795ecFdFe1972
Deploying DAO...
DAO Jane DAO Governor deployed to 0x8D5C552Bb20117090593148e6BBE021337FF72f8
$ DEPLOY=1 npx hardhat run scripts/finalizeDAO.js --network mainnet
Deployer account is 0x122B6caf3422a9e4D2D85A48D78Bb4b3D5748239
Deploying Timelock...
Configuring Timelock...
GRANT ROLE PROPOSER DONE
GRANT ROLE EXECUTOR DONE
Timelock configured
Configuring Upgrades...
✔ 0x157a0Adbc19Bedf5C7B2E1f14d71F781267E6821 (transparent) proxy ownership transfered through admin proxy
✔ 0x8D5C552Bb20117090593148e6BBE021337FF72f8 (transparent) proxy ownership transfered through admin proxy
Upgrades configured
```

Verification
---
```
$ VERIFY=1 npx hardhat verify --network mainnet 0x157a0Adbc19Bedf5C7B2E1f14d71F781267E6821
Verifying implementation: 0xA493ea495f758Cb785D62fA050B64103501F278E
Nothing to compile
Successfully submitted source code for contract
contracts/Token.sol:Token at 0xA493ea495f758Cb785D62fA050B64103501F278E
for verification on the block explorer. Waiting for verification result...

Successfully verified contract Token on Etherscan.
https://etherscan.io/address/0xA493ea495f758Cb785D62fA050B64103501F278E#code
Verifying proxy: 0x157a0Adbc19Bedf5C7B2E1f14d71F781267E6821
Contract at 0x157a0Adbc19Bedf5C7B2E1f14d71F781267E6821 already verified.
Linking proxy 0x157a0Adbc19Bedf5C7B2E1f14d71F781267E6821 with implementation
Successfully linked proxy to implementation.
Verifying proxy admin: 0x0562a70A3148AaD4c14E8d4c99B83E4f0B19E0df
Contract at 0x0562a70A3148AaD4c14E8d4c99B83E4f0B19E0df already verified.

Proxy fully verified.
$ VERIFY=1 npx hardhat verify --network mainnet 0x8D5C552Bb20117090593148e6BBE021337FF72f8
Verifying implementation: 0xF04859fe031a351C54e3772EA65c77a3506C5F37
Nothing to compile
Successfully submitted source code for contract
contracts/DAO.sol:DAO at 0xF04859fe031a351C54e3772EA65c77a3506C5F37
for verification on the block explorer. Waiting for verification result...

Successfully verified contract DAO on Etherscan.
https://etherscan.io/address/0xF04859fe031a351C54e3772EA65c77a3506C5F37#code
Verifying proxy: 0x8D5C552Bb20117090593148e6BBE021337FF72f8
Contract at 0x8D5C552Bb20117090593148e6BBE021337FF72f8 already verified.
Linking proxy 0x8D5C552Bb20117090593148e6BBE021337FF72f8 with implementation
Successfully linked proxy to implementation.
Verifying proxy admin: 0x0562a70A3148AaD4c14E8d4c99B83E4f0B19E0df
Contract at 0x0562a70A3148AaD4c14E8d4c99B83E4f0B19E0df already verified.

Proxy fully verified.
```