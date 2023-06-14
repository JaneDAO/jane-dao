require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');

const config = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

if(process.env.DEPLOY) {
  require('dotenv').config();
  const INFURA_API_KEY = process.env['INFURA_API_KEY'];
  const MNEMONIC = process.env['MNEMONIC'];
  config.networks = {
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: {
        mnemonic: MNEMONIC
      }
    }
  };
}


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = config;
