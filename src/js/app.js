App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets.
    $.getJSON("../cars.json", function (data) {
      var carsRow = $("#carsRow");
      var carTemplate = $("#carTemplate");
      App.carTemplate = carTemplate;
      for (i = 0; i < data.length; i++) {
        carTemplate
          .find(".panel-title")
          .text(data[i].year + " " + data[i].make + " " + data[i].model);
        carTemplate.find("img").attr("src", data[i].picture);
        carTemplate.find(".car-make").text(data[i].make);
        carTemplate.find(".car-model").text(data[i].model);
        carTemplate.find(".car-year").text(data[i].year);
        carTemplate.find(".car-lot_number").text(data[i].lot_number);
        carTemplate.find(".car-down_payment").text(data[i].down_payment);
        carTemplate.find(".car-price").text(data[i].price);
        carTemplate
          .find(".btn-buy")
          .attr("data-id", data[i].id);

        carsRow.append(carTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Seller.json", function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var SellerArtifact = data;

      App.contracts.Seller = TruffleContract(SellerArtifact);
      // Set the provider for our contract
      App.contracts.Seller.setProvider(App.web3Provider);
      App.contracts.Seller.defaults({
        from: "0xFEfE2b200BEAac5EB464D4850f391D679EDf7B25",
      });
      // Use our contract to retrieve and mark the adopted pets
      return App.setCars();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on("click", ".btn-buy", App.handleBuy);
  },

  setCars: function () {
    let sellerInstance;

    App.contracts.Seller.deployed()
      .then(async function (instance) {
        sellerInstance = instance;
        const isSeeded = await sellerInstance.isSeeded();
        if(isSeeded) {
          $.getJSON("../cars.json", function (cars) {
            console.log("cars:", cars);
            sellerInstance.setCar(
              cars.map((c) => c.id),
              cars.map((c) => c.down_payment)
            );
          });
        } else {
          const cars = await sellerInstance.getCars(); 
          for(let i = 1; i < 16; i++) {
            const isCarSold = cars[i - 1];
            const carBuyBtn = App.carTemplate.find('.btn-buy').attr('id', i);
            const isAvailableElement = carBuyBtn.parent().find('.car-is-available');
            debugger;
            isAvailableElement.text(isCarSold ? 'No' : 'Yes');
            isAvailableElement.attr('style', isCarSold ? 'color: red;' : 'color: black;');
            carBuyBtn.attr('display', isCarSold ? 'none' : 'initial');
          }
        }
      })
      .catch(function (error) {
        console.log("Error setting cars!", error);
      });
  },

  handleBuy: function (event) {
    event.preventDefault();
    console.log("event.target handleBuy:", event.target);

    var carId = parseInt($(event.target).data("id"));

    web3.eth.getAccounts(function (error) {
      if (error) {
        console.log(error);
      }

      let sellerInstance;
      App.contracts.Seller.deployed().then(async function (instance) {
        sellerInstance = instance;
        const car = await sellerInstance.cars(carId);
        console.log("BUY CAR:", car[0]);
        sellerInstance.markAsSold(carId);
      });
    });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
