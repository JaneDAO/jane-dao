const {
  mine,
  loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');
const { ethers } = require('hardhat');
process.env.TESTING = true;
const deployDAO = require('../scripts/deployDAO');
const deployToken = require('../scripts/deployToken');

describe('DAO', async function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployDAOFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const votingToken = await deployToken(
      'Jane DAO Token',
      'JANE',
      owner.address
    );
    const { dao, timelock } = await deployDAO(
      'Jane DAO Governor',
      votingToken.address,
      300 /* 300 block (~1 hour) minimum timelock when proposal is passed until execution */,
      7200 /* 1 day voting delay, about 7200 blocks */,
      50400 /* 1 week voting period, about 50400 blocks */,
      1 /* proposal creation restricted to those with at least 1% of voting power */,
      15 /* 15% of token supply for quorum on a proposal */
    );

    return { dao, timelock, owner, otherAccount, votingToken };
  }

  describe('Deployment', async function () {
    it('Should deploy it', async function () {
      const { dao } = await loadFixture(deployDAOFixture);

      // console.log(dao);
    });

    it('should have the name Jane DAO Governor', async function () {
      const { dao } = await loadFixture(deployDAOFixture);
      expect(await dao.name()).to.equal(
        'Jane DAO Governor',
        "Jane DAO Governor wasn't the name"
      );
    });
  });

  describe.skip('Upgrades', async function () {
    it('Should upgrade DAO via governance', async function () {
      const { dao } = await loadFixture(deployDAOFixture);
      // console.log(dao);
    });

    it('Should upgrade token via governance', async function () {
      const { dao, votingToken } = await loadFixture(deployDAOFixture);
      const Token2 = await ethers.getContractFactory('Token2');
      const transferCalldata = token.interface.encodeFunctionData('transfer', [
        otherAccount.address,
        grantAmount,
      ]);
      let tx = await dao.propose(
        [votingToken.address], // targets
        [0], // values
        [transferCalldata], // calldatas
        'Upgrade token' // description
      );

      // const proposal = await defender.proposeUpgrade(
      //   votingToken.address,
      //   Token2,
      //   { multisigType: 'EOA' }
      // );
      // console.log(proposal);
    });
  });

  describe('Voting', async function () {
    let dao;
    let owner;
    let otherAccount;
    let votingToken;

    beforeEach(async () => {
      // Deploy the DAO fixture
      ({ dao, owner, otherAccount, votingToken } = await loadFixture(
        deployDAOFixture
      ));
    });

    it('should allow token holders to cast votes on proposals', async function () {
      // Create a proposal
      const token = await ethers.getContractAt('Token', votingToken.address);
      await token.connect(owner).delegate(owner.address);
      await token.connect(otherAccount).delegate(otherAccount.address);
      const grantAmount = 100;
      const transferCalldata = token.interface.encodeFunctionData('transfer', [
        otherAccount.address,
        grantAmount,
      ]);
      let tx = await dao.propose(
        [votingToken.address], // targets
        [0], // values
        [transferCalldata], // calldatas
        'Give grant to otherAccount' // description
      );
      let receipt = await tx.wait();
      const proposalId = receipt.events[0].args.proposalId;
      expect(proposalId).to.not.equal(0);

      const votingDelay = BigInt(await dao.votingDelay());
      await mine(votingDelay);

      // Cast votes
      const support = 1; // For 'forVotes'
      await dao.connect(otherAccount).castVote(proposalId, support);
      await tx.wait();
      await dao.connect(owner).castVote(proposalId, support);
      await tx.wait();
      // Manually update the vote count

      // Check vote count
      const votes = await dao.proposalVotes(proposalId);

      expect(votes.forVotes).to.equal(await token.balanceOf(owner.address));
      expect(votes.forVotes).to.be.above(0);
    });

    it('should only allow token holders to cast votes', async function () {
      const token = await ethers.getContractAt('Token', votingToken.address);
      await token.connect(owner).delegate(owner.address);
      await token.connect(otherAccount).delegate(otherAccount.address);
      const grantAmount = 100;
      const transferCalldata = token.interface.encodeFunctionData('transfer', [
        otherAccount.address,
        grantAmount,
      ]);
      let tx = await dao.propose(
        [votingToken.address], // targets
        [0], // values
        [transferCalldata], // calldatas
        'Give grant to otherAccount' // description
      );
      let receipt = await tx.wait();
      const proposalId = receipt.events[0].args.proposalId;
      expect(proposalId).to.not.equal(0);

      const votingDelay = BigInt(await dao.votingDelay());
      await mine(votingDelay);

      // Cast votes
      const support = 1; // For 'forVotes'
      await dao.connect(otherAccount).castVote(proposalId, support);
      await tx.wait();

      // Check vote count
      const votes = await dao.proposalVotes(proposalId);

      expect(votes.forVotes).to.equal(0);
    });
  });

  describe('Proposal Execution', async function () {
    let dao;
    let timelock;
    let owner;
    let otherAccount;
    let votingToken;

    beforeEach(async () => {
      // Deploy the DAO fixture
      ({ dao, timelock, owner, otherAccount, votingToken } = await loadFixture(
        deployDAOFixture
      ));
    });

    it('should execute proposals with timelock', async function () {
      // Create a proposal
      const token = await ethers.getContractAt('Token', votingToken.address);
      const grantAmount = 100;
      await token.connect(owner).transfer(timelock.address, grantAmount);
      await token.connect(owner).delegate(owner.address);
      const transferCalldata = token.interface.encodeFunctionData('transfer', [
        otherAccount.address,
        grantAmount,
      ]);
      const description = 'Give grant to otherAccount';
      let tx = await dao.propose(
        [votingToken.address], // targets
        [0], // values
        [transferCalldata], // calldatas
        description // description
      );
      let receipt = await tx.wait();
      const proposalId = receipt.events[0].args.proposalId;
      expect(proposalId).to.not.equal(0);

      const votingDelay = BigInt(await dao.votingDelay());
      await mine(votingDelay);

      // Cast votes
      const support = 1; // For 'forVotes'
      await dao.connect(owner).castVote(proposalId, support);
      await tx.wait();

      const votingPeriod = BigInt(await dao.votingPeriod());
      await mine(votingPeriod);

      // const descriptionHash = web3.utils.keccak256(description.slice(-1).find(Boolean))
      const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(description)
      );

      tx = await dao.queue(
        [votingToken.address], // targets
        [0], // values
        [transferCalldata], // calldatas
        descriptionHash // description
      );

      const minimumTimelockDelay = await timelock.getMinDelay();
      await mine(minimumTimelockDelay);

      expect(await token.balanceOf(otherAccount.address)).to.equal(0);

      tx = await dao.execute(
        [votingToken.address], // targets
        [0], // values
        [transferCalldata], // calldatas
        descriptionHash // description
      );

      expect(await token.balanceOf(otherAccount.address)).to.equal(grantAmount);
    });
  });

  describe('Governor Settings', async function () {});

  describe('Quorum', async function () {});

  describe('Edge Cases and Errors', async function () {});
});
