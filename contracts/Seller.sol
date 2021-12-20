// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

import "./CarAd.sol";

contract Seller {
    struct Car {
        CarAd car;
        bool isSold;
    }
    address owner;
    mapping(uint => Car) public cars;
    bool public isSeeded;

    constructor() public {
        owner = msg.sender;
    }

    function getCars() public view returns(bool[16]) {
        bool[16] carsToReturn;
        for(uint i = 0; i < 15; i += 1) {
            carsToReturn[i] = cars[i].isSold;
        }
        return carsToReturn;
    }

    function setCar(uint[16] ids, uint[16] downPayments) public {
        for (uint i = 0; i < 16; i++) {
            uint carId = ids[i];
            CarAd carToSet = new CarAd(this, carId, downPayments[i]);
            cars[carId].car = carToSet;
        }
        isSeeded = true;
    }

    function markAsSold(uint256 carId) public payable {
        cars[carId].isSold = true;
    }
}
