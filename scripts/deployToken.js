// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require('hardhat');
const { settings } = require('./utils');

async function deploy(name, symbol, firstHolder) {
  // Deploying
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer account is ${deployer.address}`);

  console.log('Deploying Token...');
  const Token = await ethers.getContractFactory('Token');
  const instance = await upgrades.deployProxy(Token, [
    name,
    symbol,
    firstHolder,
  ]);
  await instance.deployed();

  console.log(`Token ${name}/${symbol} deployed to ${instance.address}. First holder ${firstHolder}`);

  return instance;
}

if (!process.env.TESTING) {
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  const [name, symbol, firstHolder] = settings([
    'TOKEN_NAME',
    'TOKEN_SYMBOL',
    'FIRST_HOLDER',
  ]);
  deploy(name, symbol, firstHolder).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = deploy;
