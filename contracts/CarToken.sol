pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CarToken is ERC20 {
    uint public INITIAL_SUPPLY = 2000000000;

    constructor() ERC20("Car Token", "CT") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}