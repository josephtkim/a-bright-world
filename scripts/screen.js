(function() {
  class Screen {
    constructor(canvas, ctx) {
      this._canvas = canvas;
      this._ctx = ctx;

      this._width = canvas.width;
      this._height = canvas.height;

      this.colors = [
        "#1a1a1a",
        "#333333",
        "#4d4d4d",
        "#737373",
        "#999999",
        "#bfbfbf",
        "#e6e6e6",
        "#ffffff"
      ];

      this.currentBrightness = 0;
      this.topScreen = document.getElementById("top-half");

      // Main building
      const main1 = new Image();
      main1.src = "./assets/CentralBuildingLvl1.png";
      const main2 = new Image();
      main2.src = "./assets/CentralBuildingLvl2.png";
      const main3 = new Image();
      main3.src = "./assets/CentralBuildingLvl3.png";
      const main4 = new Image();
      main4.src = "./assets/CentralBuildingLvl4.png";

      // Residential buildings
      const residential1 = new Image();
      residential1.src = "./assets/ResidentialLvl1.png";
      const residential2 = new Image();
      residential2.src = "./assets/ResidentialLvl2.png";
      const residential3 = new Image();
      residential3.src = "./assets/ResidentialLvl3.png";
      const residential4 = new Image();
      residential4.src = "./assets/ResidentialLvl4.png";

      // Commercial buildings
      const commercial1 = new Image();
      commercial1.src = "./assets/CommercialLvl1.png";
      const commercial2 = new Image();
      commercial2.src = "./assets/CommercialLvl2.png";
      const commercial3 = new Image();
      commercial3.src = "./assets/CommercialLvl3.png";
      const commercial4 = new Image();
      commercial4.src = "./assets/CommercialLvl4.png";

      // Agricultural buildings
      const agricultural1 = new Image();
      agricultural1.src = "./assets/AgriculturalLvl1.png";
      const agricultural2 = new Image();
      agricultural2.src = "./assets/AgriculturalLvl2.png";
      const agricultural3 = new Image();
      agricultural3.src = "./assets/AgriculturalLvl3.png";
      const agricultural4 = new Image();
      agricultural4.src = "./assets/AgriculturalLvl4.png";

      this.images = [
        residential1, residential2, residential3, residential4,
        commercial1, commercial2, commercial3, commercial4,
        agricultural1, agricultural2, agricultural3, agricultural4,
        main1, main2, main3, main4
      ];

      this.image_w = 64;
      this.image_h = 64;
    }

    update() {
      this._ctx.clearRect(0, 0, this._width, this._height);
      this._ctx.fillStyle = this.colors[this.currentBrightness];
      this._ctx.fillRect(0, 0, this._width, this._height);

      this.brightenWorld();
      this.drawBuildings(window.game.buildings);
    }

    drawBuildings(buildingList) {
      for (var i = 0; i < buildingList.length; i++) {
        var building = buildingList[i];

        this._ctx.drawImage(this.images[building.imageIndex], building.x, building.y);
      }
    }

    brightenWorld() {
      document.body.style.backgroundColor = this.colors[this.currentBrightness];
      this.topScreen.style.backgroundColor = this.colors[this.currentBrightness];
    }
  }

  window.Screen = Screen;
})();
