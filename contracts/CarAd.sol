// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;

import "./Seller.sol";

contract CarAd {
    
    address sellerContractAddress;
    uint public id;
    uint public downPayment;
    bool public isPaid;

    constructor(Seller _sellerContract, uint _id, uint _downPayment) public {
        sellerContractAddress = address(_sellerContract);
        id = _id;
        downPayment = _downPayment;
    }

    function() public payable {
        require(downPayment == msg.value, "Value is not equal to down payment");
        isPaid = true;
        Seller seller = Seller(sellerContractAddress);
        seller.markAsSold(id);
    }
}
