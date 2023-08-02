// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require('hardhat');
const { settings } = require('./utils');

async function deploy(
  name,
  votingToken,
  minimumTimelock,
  votingDelay,
  votingPeriod,
  proposalThreshold,
  quorumNumeratorValue
) {
  // Deploying
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer account is ${deployer.address}`);

  // normal setup: governor is proposer, everyone is executor, timelock is its own admin
  console.log('Deploying Timelock...');
  const timelockAddress = '0x61436342A09D9E6E616eD76B2D2795ecFdFe1972';
  const timelock = await ethers.getContractAt(
    'TimelockController',
    timelockAddress,
    deployer
  );

  const daoAddress = '0x8D5C552Bb20117090593148e6BBE021337FF72f8';
  console.log('Configuring Timelock...');
  await timelock.grantRole(await timelock.PROPOSER_ROLE(), daoAddress);
  console.log('GRANT ROLE PROPOSER DONE');
  await timelock.grantRole(
    await timelock.EXECUTOR_ROLE(),
    ethers.constants.AddressZero
  );
  console.log('GRANT ROLE EXECUTOR DONE');
  await timelock.revokeRole(
    await timelock.TIMELOCK_ADMIN_ROLE(),
    deployer.address
  );
  console.log('Timelock configured');

  console.log('Configuring Upgrades...');
  await upgrades.admin.transferProxyAdminOwnership(timelock.address);
  console.log('Upgrades configured');

  return { timelock };
}

if (!process.env.TESTING) {
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  const [
    name,
    votingToken,
    minimumTimelock,
    votingDelay,
    votingPeriod,
    proposalThreshold,
    quorumNumeratorValue,
  ] = settings([
    'DAO_NAME',
    'VOTING_TOKEN',
    'MINIMUM_TIMELOCK',
    'VOTING_DELAY',
    'VOTING_PERIOD',
    'PROPOSAL_THRESHOLD',
    'QUORUM_NUMERATOR_VALUE',
  ]);
  deploy(
    name,
    votingToken,
    minimumTimelock,
    votingDelay,
    votingPeriod,
    proposalThreshold,
    quorumNumeratorValue
  ).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = deploy;
