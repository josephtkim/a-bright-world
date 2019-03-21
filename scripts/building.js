(function() {
  class Building {
    constructor(type, pBonus, mBonus, fBonus, price, maxPIncrease, maxFIncrease, imgIndex) {
      this.type = type; // Building category: Residential, Commercial, Agricultural
      this.level = 1; // Upgrade level of building: 1-min, 2, 3, 4-max
      this.imageIndex = imgIndex;

      this.popGrowthBonus = pBonus; // bonus added to population growth
      this.moneyGrowthBonus = mBonus; // bonus added to money growth
      this.foodGrowthBonus = fBonus; // bonus added to food growth

      this.price = price; // cost to build
      this.upgradePrice = price * 22; // Cost to upgrade

      this.maxPopulationIncrease = maxPIncrease; // Amount added to max population
      this.maxFoodIncrease = maxFIncrease;

      this.x;
      this.y;
    }

    // Sets the location coordinates of the building on the screen
    setLocation(coordinates) {
      var x = coordinates[0];
      var y = coordinates[1];
      this.x = (900 / 2) - (64 / 2) + (x * 60); // Other possible values x *: 48; 66
      this.y = (450 / 2) - (64 / 2) + (y * 48); // Other possible values y *: 48; 34
    }

    upgrade() {      
      this.level = this.level + 1;
      this.imageIndex = this.imageIndex + 1;
      this.upgradePrice = this.upgradePrice * 30;

      if (this.type === "residential") {
        this.popGrowthBonus *= 8;
        window.game.maximum["population"] -= this.maxPopulationIncrease;
        this.maxPopulationIncrease = (this.maxPopulationIncrease * 20);
      }
      if (this.type === "commercial") {
        this.moneyGrowthBonus *= 10;
        this.popGrowthBonus *= 2;
      }
      if (this.type === "agricultural") {
        this.moneyGrowthBonus *= 5;
        this.popGrowthBonus *= 3;
        this.foodGrowthBonus *= 8;
        window.game.maximum["food"] -= this.maxFoodIncrease;
        this.maxFoodIncrease = (this.maxFoodIncrease * 10);
      }

      if (this.type === "main") {
        if (this.level === 2) {
          window.game.maximum["population"] -= this.maxPopulationIncrease;
          this.maxPopulationIncrease = 400;
        }
        else {
          window.game.maximum["population"] -= this.maxPopulationIncrease;
          this.maxPopulationIncrease = (this.maxPopulationIncrease * 10);
        }
      }
    }
  }

  window.Building = Building;
})()
