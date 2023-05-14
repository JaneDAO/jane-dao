// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '../Token.sol';

contract Token2 is Token {
    function upgraded() public pure returns (string memory) {
        return 'yes';
    }
}
