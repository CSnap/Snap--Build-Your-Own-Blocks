(function () {
    return function () {
		var costume = this.costumes.contents[this.getCostumeIdx()-1],
		canvas = newCanvas(costume.extent()),
		ctx = canvas.getContext('2d');
		
		ctx.translate(costume.width(), 0);
		ctx.scale(-1, 1);
		ctx.drawImage(costume.contents, 0, 0);
		costume.contents=canvas;
		costume.rotationCenter = new Point(
			   costume.width() - costume.rotationCenter.x,
			   costume.rotationCenter.y
		);
		
		this.costumes.contents[this.getCostumeIdx()-1] = costume;
		this.costume = costume;
		this.flippedY = !this.flippedY;
		this.changed();
		this.drawNew();
		this.changed();
        this.positionTalkBubble();
    };
}());

//# sourceURL=reflectY.js