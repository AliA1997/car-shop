// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./Seller.sol";

contract CarAd {
    
    Seller sellerContract;
    uint public id;
    uint public downPayment;
    bool public isPaid;

    constructor(Seller _sellerContract, uint _id) public {
        sellerContract = _sellerContract;
        id = _id;
    }

    receive() external payable {
        require(downPayment == msg.value, "Value is not equal to down payment");
        isPaid = true;
        (bool success, ) = address(sellerContract).call{value: msg.value}(abi.encodeWithSignature("buy)uint)", id));
        require(success, "Purchase not successful");
    }
}
