// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "./CarAd.sol";

contract Seller {
    struct Car {
        CarAd car;
        bool isSold;
    }
    address owner;
    mapping(uint => Car) public cars;


    constructor() public {
        owner = msg.sender;
    }

    function getCars() public view returns(Car[] memory) {
        Car[] memory carsToReturn;
        for(uint i = 0; i < 15; i += 1) {
            carsToReturn[i] = cars[i];
        }
        return carsToReturn;
    }

    function markAsSold(uint256 carId) public payable {
        cars[carId].isSold = true;
    }
}
