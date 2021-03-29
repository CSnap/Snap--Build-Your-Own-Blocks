(function () {
	return function (num) {
	num = num*255/100;
	var flipBackX = false, flipBackY = false, costume = this.costumes.contents[this.getCostumeIdx()-1];
	if(this.flippedY)
	{
		this.flipYAxis();
		flipBackY = true;
	}
	if(this.flippedX)
	{
		this.flipXAxis();
		flipBackX = true;
	}
	if(!costume.originalPixels) {
		costume.originalPixels = costume.contents.getContext('2d')
		   .getImageData(0, 0, costume.contents.width,
			  costume.contents.height);
	 }
     if(!costume.costumeColor) {
         costume.costumeColor = new Color(0,0,0);
     }
	var temp = costume.contents.getContext('2d')
		   .getImageData(0, 0, costume.contents.width,
			  costume.contents.height);
	 for(var I = 0, L = temp.data.length; I < L; I += 4){
		if(temp.data[I + 3] > 0){
		   // If it's not a transparent pixel
		   temp.data[I] = temp.data[I] / 255 * num;
		   temp.data[I + 1] = temp.data[I + 1] / 255 * num;
		   temp.data[I + 2] = temp.data[I + 2] / 255 * num;
		}
	 }
	 costume.contents.getContext('2d')
		.putImageData(temp, 0, 0);
	this.costumes.contents[this.getCostumeIdx()-1] = costume;
	if(flipBackY)
	{
		this.flipYAxis();
	}
	if(flipBackX)
	{
		this.flipXAxis();
	}
    this.changed();
    this.drawNew();
	};
}());


//# sourceURL=changeCostumeShade.js