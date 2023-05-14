const {
  time,
  loadFixture,
} = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');
process.env.TESTING = true;
const deploy = require('../scripts/deployToken');
describe('Token', async function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTokenFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const token = await deploy('Jane DAO Token', 'JANE', owner.address);

    return { token, owner, otherAccount };
  }

  describe('Deployment', async function () {
    it('Should deploy it', async function () {
      const { token } = await loadFixture(deployTokenFixture);

      // console.log(token);
    });

    it('should have the name Jane DAO Token', async function () {
      const { token } = await loadFixture(deployTokenFixture);
      expect(await token.name()).to.equal(
        'Jane DAO Token',
        "Jane DAO Token wasn't the name"
      );
    });

    it('should have the symbol JANE', async function () {
      const { token } = await loadFixture(deployTokenFixture);
      expect(await token.symbol()).to.equal('JANE', "JANE wasn't the symbol");
    });

    it('should have decimals set to 18', async function () {
      const { token } = await loadFixture(deployTokenFixture);
      expect(await token.decimals()).to.equal(
        18,
        "18 wasn't the value of decimals"
      );
    });

    it('should set totalSupply to 10n*10n**9n*10n**18n base units', async function () {
      const { token } = await loadFixture(deployTokenFixture);
      expect(await token.totalSupply()).to.equal(
        10n * 10n ** 9n * 10n ** 18n,
        "10n*10n**9n*10n**18n wasn't the value of totalSupply base units"
      );
    });

    it('should put 10n*10n**9n*10n**18n base units in the first holder account', async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);
      expect(await token.balanceOf(owner.address)).to.equal(
        10n * 10n ** 9n * 10n ** 18n
      );
    });
  });

  describe('Transfers', function () {
    it('should allow transfer() of tokens by address owner', async function () {
      const { token, owner, otherAccount } = await loadFixture(
        deployTokenFixture
      );

      const account0StartingBalance = BigInt(
        await token.balanceOf(owner.address)
      );
      const account1StartingBalance = BigInt(
        await token.balanceOf(otherAccount.address)
      );

      const xferAmt = 100000000n;
      await token.connect(owner).transfer(otherAccount.address, xferAmt);
      // utils.assertEvent(token, { event: 'Transfer' });
      const account0EndingBalance = await token.balanceOf(owner.address);
      const account1EndingBalance = await token.balanceOf(otherAccount.address);
      expect(account0EndingBalance).to.equal(account0StartingBalance - xferAmt);
      expect(account1EndingBalance).to.equal(account1StartingBalance + xferAmt);
    });

    it('should allow transferFrom(), when properly approved,', async function () {
      const { token, owner, otherAccount } = await loadFixture(
        deployTokenFixture
      );

      const account0StartingBalance = BigInt(
        await token.balanceOf(owner.address)
      );
      const account1StartingBalance = BigInt(
        await token.balanceOf(otherAccount.address)
      );

      const xferAmt = 100000000n;
      await token.connect(owner).approve(otherAccount.address, xferAmt);
      // utils.assertEvent(meta, { event: 'Approval' });
      await token
        .connect(otherAccount)
        .transferFrom(owner.address, otherAccount.address, xferAmt);
      const account0EndingBalance = await token.balanceOf(owner.address);
      const account1EndingBalance = await token.balanceOf(otherAccount.address);
      expect(account0EndingBalance).to.equal(account0StartingBalance - xferAmt);
      expect(account1EndingBalance).to.equal(account1StartingBalance + xferAmt);
    });

    it('should allow approve(), and allowance()', async function () {
      const { token, owner, otherAccount } = await loadFixture(
        deployTokenFixture
      );

      const xferAmt = 100000000n;
      await token.connect(owner).approve(otherAccount.address, xferAmt);
      // utils.assertEvent(meta, { event: 'Approval' });
      await token.connect(owner).allowance(owner.address, otherAccount.address);
      const allowance = BigInt(
        await token
          .connect(owner)
          .allowance(owner.address, otherAccount.address)
      );
      expect(allowance).to.equal(xferAmt);
      await token.connect(owner).approve(otherAccount.address, 0);
    });

    it('should not allow transfer() when _to is null', async function () {
      const { token, owner, otherAccount } = await loadFixture(
        deployTokenFixture
      );

      const xferAmt = 100000000n;
      await expect(
        token.connect(otherAccount).transfer(null, xferAmt)
      ).to.be.rejectedWith(Error);
    });

    it('should not allow transfer() when _to is 0x0000000000000000000000000000000000000000', async function () {
      const { token, owner, otherAccount } = await loadFixture(
        deployTokenFixture
      );

      const xferAmt = 100000000n;
      await expect(
        token
          .connect(otherAccount)
          .transfer('0x0000000000000000000000000000000000000000', xferAmt)
      ).to.be.rejectedWith(Error);
    });

    it('should not allow transfer() when _to is the contract address', async function () {
      const { token, owner, otherAccount } = await loadFixture(
        deployTokenFixture
      );

      const xferAmt = 100000000n;
      await expect(
        token.connect(otherAccount).transfer(token.address, xferAmt)
      ).to.be.rejectedWith(Error);
    });

    it('should not allow transferFrom() when _to is null', async function () {
      const { token, owner, otherAccount } = await loadFixture(
        deployTokenFixture
      );

      const xferAmt = 100000000n;
      await token.connect(owner).approve(otherAccount.address, xferAmt);
      // utils.assertEvent(meta, { event: 'Approval' });
      await expect(
        token.connect(otherAccount).transferFrom(owner.address, null, xferAmt)
      ).to.be.rejectedWith(Error);
      await token.connect(owner).approve(otherAccount.address, 0);
    });

    it('should not allow transferFrom() when _to is 0x0000000000000000000000000000000000000000', async function () {
      const { token, owner, otherAccount } = await loadFixture(
        deployTokenFixture
      );

      const xferAmt = 100000000n;
      await token.connect(owner).approve(otherAccount.address, xferAmt);
      // utils.assertEvent(meta, { event: 'Approval' });
      await expect(
        token
          .connect(otherAccount)
          .transferFrom(
            owner.address,
            '0x0000000000000000000000000000000000000000',
            xferAmt
          )
      ).to.be.rejectedWith(Error);
      await token.connect(owner).approve(otherAccount.address, 0);
    });

    it.skip('should not allow transferFrom() when _to is the contract address', async function () {
      const { token, owner, otherAccount } = await loadFixture(
        deployTokenFixture
      );

      const xferAmt = 100000000n;
      await token.connect(owner).approve(otherAccount.address, xferAmt);
      // utils.assertEvent(meta, { event: 'Approval' });
      await expect(
        token
          .connect(otherAccount)
          .transferFrom(owner.address, token.address, xferAmt)
      ).to.be.rejectedWith(Error);
      await token.connect(owner).approve(otherAccount.address, 0);
    });

    it('should not be able to send ETH to contract', async function () {
      const { token, owner, otherAccount } = await loadFixture(
        deployTokenFixture
      );
      await expect(
        owner.sendTransaction({
          to: token.address,
          value: ethers.utils.parseEther('0.1'),
        })
      ).to.be.rejectedWith(Error);
      // but we can send normally to another address
      await owner.sendTransaction({
        to: otherAccount.address,
        value: ethers.utils.parseEther('0.1'),
      });
    });
  });
});
