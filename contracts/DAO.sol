// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/governance/extensions/GovernorSettingsUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/governance/extensions/GovernorTimelockControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

contract DAO is
    Initializable,
    GovernorUpgradeable,
    GovernorSettingsUpgradeable,
    GovernorCountingSimpleUpgradeable,
    GovernorVotesUpgradeable,
    GovernorVotesQuorumFractionUpgradeable,
    GovernorTimelockControlUpgradeable
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev function to initialize the contract one-time after deployment
     * @param _name: governance contract name
     * @param _votingDelay: how long after a proposal is created that voting power is fixed (a larger delay gives users time to unstake tokens)
     * @param _votingPeriod: how long a proposal remains open to vote
     * @param _proposalThreshold: proposal threshold can also be set, which restricts proposal creation to accounts with enough voting power.
     * @param _quorumNumeratorValue: Initialize quorum as a fraction of the token’s total supply. The fraction is specified as numerator / denominator. By default the denominator is 100, so quorum is specified as a percent: a numerator of 10 corresponds to quorum being 10% of total supply.
     * @param _token: governance token required for voting on proposals
     * @param _timelock: timelock to allow proposals to be executed with a delay once approved
     */
    function initialize(
        string memory _name,
        uint256 _votingDelay,
        uint256 _votingPeriod,
        uint256 _proposalThreshold,
        uint256 _quorumNumeratorValue,
        IVotesUpgradeable _token,
        TimelockControllerUpgradeable _timelock
    ) public initializer {
        __Governor_init(_name);
        __GovernorSettings_init(
            _votingDelay,
            _votingPeriod,
            _proposalThreshold
        );
        __GovernorCountingSimple_init();
        __GovernorVotes_init(_token);
        __GovernorVotesQuorumFraction_init(_quorumNumeratorValue);
        __GovernorTimelockControl_init(_timelock);
    }

    // The following functions are overrides required by Solidity.

    function votingDelay()
        public
        view
        override(IGovernorUpgradeable, GovernorSettingsUpgradeable)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernorUpgradeable, GovernorSettingsUpgradeable)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(
        uint256 blockNumber
    )
        public
        view
        override(IGovernorUpgradeable, GovernorVotesQuorumFractionUpgradeable)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function state(
        uint256 proposalId
    )
        public
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    )
        public
        override(GovernorUpgradeable, IGovernorUpgradeable)
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }

    function proposalThreshold()
        public
        view
        override(GovernorUpgradeable, GovernorSettingsUpgradeable)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    )
        internal
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
    {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    )
        internal
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
