App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets.
    $.getJSON("../cars.json", function (data) {
      var carsRow = $("#carsRow");
      var carTemplate = $("#carTemplate");

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
          .attr("data-id", data[i].id + "," + data[i].down_payment);

        carsRow.append(carTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function () {
    if (window.ethereum) {
      console.log("IF STATEMENT");
      App.web3Provider = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.log("Denied account user");
      }
    } else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    } else {
      console.log("ELSE STATEMENT");
      const provider = new Web3.providers.HttpProvider("http://localhost:7545");
      App.web3Provider = new Web3(provider);
    }
    web3 = App.web3Provider;
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("CarToken.json", function (data) {
      var CarArtifact = data;
      App.contracts.CarToken = new App.web3Provider.eth.Contract(
        CarArtifact.abi,
        CarArtifact.networks["5777"].address
      );
    });

    $.getJSON("Seller.json", function (data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var SellerArtifact = data;
      App.contracts.Seller = new App.web3Provider.eth.Contract(
        SellerArtifact.abi,
        SellerArtifact.networks["5777"].address
      );
      // Use our contract to retrieve and mark the adopted pets
      return App.markBought();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on("click", ".btn-buy", App.handleBuy);
  },

  markBought: function () {
    let sellerInstance;

    web3.eth.getAccounts(async function (error, accounts) {
      const account = accounts[0];
      const cars = await App.contracts.Seller.methods.getCars().call();
      console.log("cars", cars);
    });

    return App.bindEvents();
  },

  handleBuy: function (event) {
    event.preventDefault();

    var carId = parseInt($(event.target).data("id"));

    event.preventDefault();

    var carId = parseInt($(event.target).data("id"));
    var downPayment = parseInt($(event.target).data("down_payment"));

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      console.log("App.contracts:", App.contracts);
      try {

        App.contracts.Seller.methods.buy(carId, downPayment).send({ from: account });
      } catch(err) {
        console.log(err.message);
      }
    });
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
