(function() {
  class Game {
    constructor(canvas, ctx) {
      this._canvas = canvas;
      this._ctx = ctx;

      this.currentMoneyLabel = document.getElementById("current-money");
      this.messageLabel = document.getElementById("message");
      this.gameOverLabel = document.getElementById("gameover-message");
      this.completionTimeLabel = document.getElementById("completion-time");

      // Current counters
      this._counts = {
        "population": 1,
        "money": 0, // TESTING
        "food": 0
      }
      // Current maximums
      this.maximum = {
        "population": 10,
        "money": 99999999,
        "food": 0
      }
      // Building counts per type
      this._buildingCounts = {
        "residential": 0,
        "commercial": 0,
        "agricultural": 0
      }
      // Building category limits
      this._buildingLimits = {
        "residential": 12,
        "commercial": 12,
        "agricultural": 12
      }

      // Bonuses to growths
      this._growthBonus = {
        "population": 0,
        "money": 0,
        "food": 0
      }
      // Growth rates.
      this._growthRates = {
        "population": 0,
        "money": 1,
        "food": 0
      }

      this._buildingCount = 1;
      this.buildings = [];

      // Initialize main building, and add to the buildings array
      var mainhouse = new Building("main", 0,1,0, 0, 10,0, 12);
      mainhouse.setLocation([0, 0]);
      this.buildings.push(mainhouse);
      this._mainBuildingLevel = 1;

      // Building coordinates
      this.locations = [
      // Central building
      [0,0],
      // Layer 1
      [1, 1], [2, 0], [1, -1], [-1, -1], [-2, 0], [-1, 1],
      // Layer 2
      [0, 2], [2, 2], [3, 1], [4, 0], [3, -1], [2, -2],
      [0, -2], [-2, -2], [-3, -1], [-4, 0], [-3, 1], [-2, 2],
      // Layer 3
      [-3, 3], [-1, 3], [1, 3], [3, 3], [4, 2], [5, 1],
      [6, 0], [5, -1], [4, -2], [3, -3], [1, -3], [-1, -3],
      [-3, -3], [-4, -2], [-5, -1], [-6, 0], [-5, 1], [-4, 2]
      ];

      // Counter to clear the message text
      this.messageClearCounter = 0;

      // Game info
      this.gameover = false;
      this.counter = 0;
    }

    play() {
      this.updateControlAndScreen();
      window.setInterval(this.update.bind(this), 1000);
    }

    update() {
      if (this.gameover === false) {
        this.counter += 1;
        this.incrementValues();
        this.updateControlAndScreen();
        this.checkMainBuilding();
      }
    }

    incrementValues() {
      // Food needed for population increase
      var populationIncrease = this._growthRates["population"] + this._growthBonus["population"];
      if (populationIncrease <= this._counts["food"] && this._counts["population"] != this.maximum["population"]) {
        this._counts["population"] += populationIncrease;
        this._counts["food"] -= populationIncrease;
      }

      this._counts["food"] += (this._growthRates["food"] + (this._growthBonus["food"]));
      this._counts["food"] -= Math.ceil(this._counts["population"] / 200);
      this._counts["money"] += (this._growthRates["money"] + (this._growthBonus["money"]));

      if (this._counts["population"] > this.maximum["population"]) {
          this._counts["population"] = this.maximum["population"];
      }
      if (this._counts["money"] > this.maximum["money"]) {
        this._counts["money"] = this.maximum["money"];
      }
      if (this._counts["food"] > this.maximum["food"]) {
        this._counts["food"] = this.maximum["food"];
      }
      if (this._counts["food"] < 0) {
        this._counts["food"] = 0;
      }

      this.messageClearCounter += 1;
    }

    buySomething(building) {
      let type = building.type;

      // Make sure building count is not at limit for category
      if (this._buildingCounts[type] === this._buildingLimits[type]) {
        this.setMessageLabel("SOLD OUT!");
        return;
      }

      if (this._counts["money"] >= building.price) {
        this.messageLabel.innerHTML = "";

        this.updatePopAndGrowthRates(building);
        this.decreaseMoney(building.price);
        building.setLocation(this.locations[this._buildingCount]);

        this._buildingCount += 1;
        this._buildingCounts[type] += 1;
        this.buildings.push(building);
      }
      else {
        this.setMessageLabel("YOU NEED $" + building.price + " TO BUY");
      }
      this.updateControlAndScreen();
    }

    decreaseMoney(amount) {
      this._counts["money"] -= Math.floor(amount);
    }

    updatePopAndGrowthRates(building) {
      this.maximum["population"] += building.maxPopulationIncrease;
      this.maximum["food"] += building.maxFoodIncrease;
      this.updateGrowthRates(building.popGrowthBonus, building.moneyGrowthBonus, building.foodGrowthBonus);
    }

    updateGrowthRates(pGrowthBonus, mGrowthBonus, fGrowthBonus) {
      this._growthBonus["population"] += pGrowthBonus;
      this._growthBonus["food"] += fGrowthBonus;
      this._growthBonus["money"] += mGrowthBonus;
    }

    // Given a building type, upgrade the lowest level building of building type
    upgradeBuilding(type) {
      // If none to upgrade, exit
      if (this._buildingCounts[type] === 0) {
        return;
      }

      // Loop through each building, checking for first with matching level.
      // As soon as found, upgrade the building.
      for (var i = 1; i <= 3; i++) {
        for (var j = 1; j < this.buildings.length; j++) {
          if (this.buildings[j].type === type) {
            if (this.buildings[j].level === i) {
              var current = this.buildings[j];

              if (this._counts["money"] >= current.upgradePrice) {
                this.setMessageLabel("");
                this.decreaseMoney(current.upgradePrice);

                current.upgrade();
                this.updatePopAndGrowthRates(current);
                this.updateControlAndScreen();
              }
              else {
                this.setMessageLabel("OOPS! YOU NEED $" + current.upgradePrice + " TO UPGRADE");
              }

              return;
            }
          }
        }
      }

      if (type !== "main") {
        this.setMessageLabel("ALL UPGRADED!");
      }
    }

    checkMainBuilding() {
      if (this.buildings[0].level === 4) { // Fully upgraded
        if (this._counts["population"] === 1000000) {
          window.screen.currentBrightness = 7;
          this.setGameOver();
          window.screen.update();
        }
        return;
      }
      else if (this.buildings[0].level === 3) {
        if (this._counts["population"] >= 964000 && this.buildings.length === 37) {
          this.upgradeMainBuilding(6);
        }
        else if (this._counts["population"] >= 100000){
          window.screen.currentBrightness = 5;
        }
      }
      else if (this.buildings[0].level === 2) {
        if (this._counts["population"] >= 50000) {
          this.upgradeMainBuilding(4);
        }
        else if (this._counts["population"] >= 5000){
          window.screen.currentBrightness = 3;
        }
      }
      else if (this.buildings[0].level === 1) {
        if (this._counts["population"] >= 1000) {
          this.upgradeMainBuilding(2);
        }
        else if (this._counts["population"] >= 100){
          window.screen.currentBrightness = 1;
        }
      }
    }

    setGameOver() {
      this.gameOverLabel.innerHTML = "THANK YOU FOR PLAYING!";
      this.completionTimeLabel.innerHTML = "COMPLETION TIME: " + this.counter + " SECONDS";
      this.gameover = true;
    }

    upgradeMainBuilding(brightness) {
      this.buildings[0].upgrade();
      window.screen.currentBrightness = brightness;
      this.updateValues();
    }

    updateValues() {
      this.updatePopAndGrowthRates(this.buildings[0]);
      this.updateControlAndScreen();
    }

    updateControlAndScreen() {
      window.control.update(this._counts["population"], this.maximum["population"],
        this._counts["money"], this._counts["food"], this.maximum["food"],
        this._buildingCounts["residential"],
        this._buildingCounts["commercial"],
        this._buildingCounts["agricultural"]);
      window.screen.update();
    }

    setMessageLabel(text) {
      if (this.gameover != true) {
        this.messageLabel.innerHTML = text;
        this.messageClearCounter = 0;
      }
    }
  }

  window.Game = Game;
})();
