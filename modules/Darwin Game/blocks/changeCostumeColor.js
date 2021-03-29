(function () {
   return function (col) {
      this.costumes.contents[this.getCostumeIdx()-1].setColor(col);
      this.costumes.contents[this.getCostumeIdx()-1].colored = true;
      this.changed();
      this.drawNew();
   };
}());

//# sourceURL=changeCostumeColor.js
