(function () {
	return function (num) {
      if(!this.costumes.contents[this.getCostumeIdx()-1].costumeColor) {
         this.costumes.contents[this.getCostumeIdx()-1].costumeColor = new Color(0,0,0);
      }
		var hsv = this.costumes.contents[this.getCostumeIdx()-1].costumeColor.hsv();
      
		hsv[1] = 1; 
		hsv[2] = Math.max(Math.min(+num || 0, 100), 0) / 100;
		this.costumes.contents[this.getCostumeIdx()-1].costumeColor.set_hsv.
         apply(this.costumes.contents[this.getCostumeIdx()-1].costumeColor, hsv);
      this.costumes.contents[this.getCostumeIdx()-1].setColor(this.costumes.contents[this.getCostumeIdx()-1].costumeColor);
      this.changed();
      this.drawNew();
	};
}());

//# this sourceURL=changeCostumeShade.js