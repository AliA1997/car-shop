const Seller = artifacts.require('Seller');
const CarToken = artifacts.require('CarToken');

module.exports = function(deployer) {
    deployer.deploy(Seller);
    deployer.deploy(CarToken);
}