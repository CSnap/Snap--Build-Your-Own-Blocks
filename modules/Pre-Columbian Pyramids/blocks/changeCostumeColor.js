(function () {
   return function (col) {
      
      this.costumes.contents[this.getCostumeIdx()-1].setColor(col);
      this.changed();
      this.drawNew();
   };
}());

//# sourceURL=changeCostumeColor.js
