// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '../DAO.sol';

contract DAO2 is DAO {
    function upgraded() public pure returns (string memory) {
        return 'yes';
    }
}
