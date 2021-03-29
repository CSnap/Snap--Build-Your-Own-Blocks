(function () {
    return function () {
		var costume = this.costumes.contents[this.getCostumeIdx()-1],
		canvas = newCanvas(costume.extent()),
		ctx = canvas.getContext('2d');
		
		ctx.translate(0, costume.height());
		ctx.scale(1, -1);
		ctx.drawImage(costume.contents, 0, 0);
		costume.contents=canvas;
		costume.rotationCenter = new Point(
			   costume.rotationCenter.x,
			   costume.height() - costume.rotationCenter.y
		);
		
		this.costumes.contents[this.getCostumeIdx()-1] = costume;
		this.costume = costume;
		this.flippedX = !this.flippedX;
		this.changed();
		this.drawNew();
		this.changed();
        this.positionTalkBubble();
    };
}());

//# sourceURL=reflectX.js