(function() {
  class Controls {
    constructor() {
      this._currentPopulation = document.getElementById("current-population");
      this._currentMoney = document.getElementById("current-money");
      this._currentFood = document.getElementById("current-food");

      // Optional implementation for including current/max values as a fraction
      // this._currentMaxPopulation = document.getElementById("max-population");
      // this._currentMaxFood = document.getElementById("max-food");

      this._currentResidentialBuildings = document.getElementById("current-residential-count");
      this._currentCommercialBuildings = document.getElementById("current-commercial-count");
      this._currentAgriculturalBuildings = document.getElementById("current-agricultural-count");

      // Buying buildings
      var buildHouseButton = document.getElementById("build-house-button");
      buildHouseButton.onclick = this.buyHouse;
      var buildBusinessButton = document.getElementById("build-business-button");
      buildBusinessButton.onclick = this.buyBusiness;
      var buildFarmButton = document.getElementById("build-farm-button");
      buildFarmButton.onclick = this.buyFarm;

      // Upgrading buildings
      var upgradeResidentialButton = document.getElementById("upgrade-residential");
      upgradeResidentialButton.onclick = this.upgradeResidential;
      var upgradeCommercialButton = document.getElementById("upgrade-commercial");
      upgradeCommercialButton.onclick = this.upgradeCommercial;
      var upgradeAgriculturalButton = document.getElementById("upgrade-agricultural");
      upgradeAgriculturalButton.onclick = this.upgradeAgricultural;
    }

    updateCurrentPopulation(population) {
      this._currentPopulation.innerHTML = population;
    }
    updateCurrentMoney(money) {
      this._currentMoney.innerHTML = "$" + money;
    }
    updateCurrentFood(food) {
      this._currentFood.innerHTML = food;
    }
    updateBuildingCount(residentialBuildingCount, commercialBuildingCount, agriculturalBuildingCount) {
      this._currentResidentialBuildings.innerHTML = residentialBuildingCount;
      this._currentCommercialBuildings.innerHTML = commercialBuildingCount;
      this._currentAgriculturalBuildings.innerHTML = agriculturalBuildingCount;
    }
    updateMessageDisplay() {
      if (window.game.messageClearCounter >= 9) {
        window.game.messageLabel.innerHTML = "";
      }
    }

    // type, pBonus,mBonus,fBonus, price, maxPIncrease,maxFIncrease, imgIndex
    buyHouse() {
      window.game.buySomething(new Building("residential", 1,0,0, 10, 10,0, 0));
    }
    buyBusiness() {
      window.game.buySomething(new Building("commercial", 1,5,0, 50, 0,0, 4));
    }
    buyFarm() {
      window.game.buySomething(new Building("agricultural", 1,1,2, 40, 0,10, 8));
    }

    upgradeResidential() {
      window.game.upgradeBuilding("residential");
    }
    upgradeCommercial() {
      window.game.upgradeBuilding("commercial");
    }
    upgradeAgricultural() {
      window.game.upgradeBuilding("agricultural");
    }
  }

  window.Controls = Controls;
})();
