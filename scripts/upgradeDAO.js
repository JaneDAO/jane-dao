// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require('hardhat');
const { settings } = require('./utils');

async function main(address) {
  // Upgrading
  const DAO = await ethers.getContractFactory('DAO');
  const upgraded = await upgrades.upgradeProxy(address, DAO);

  console.log(`DAO upgraded at ${upgraded.address}`);
}

if (!process.env.TESTING) {
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  const [address] = settings(['DAO_ADDRESS']);

  main(address).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = main;
