(function () {
    return function (percent, direction) {
        var dest, delta=radians(this.heading), width=0, height=0;
        var newX=0, newY=0, dist=0, angle=0, X=0, Y=0;

		if(this.costume!=null)
			{
				width = this.costume.contents.width * this.scale;
				height = this.costume.contents.height * this.scale;
			}
			else
			{
				width = 32 * this.scale;
				height = 20 * this.scale;
			}


		if(direction[0] === 'height') {
			newY = this.yPosition() +
				(height * percent/100);
			dist = Math.sqrt(Math.pow(this.yPosition()-newY, 2));
			angle = this.heading*(Math.PI/180);

		} else {
			newX = this.xPosition() + 
				(width * percent/100);
			dist = Math.sqrt(Math.pow(this.xPosition()-newX, 2));
			angle = this.heading*(Math.PI/180)+(Math.PI/2);
		}
		if(dist!=0)
		{
			X = (-percent/Math.abs(percent))*dist*Math.cos(angle)+this.xPosition();
			Y = (percent/Math.abs(percent))*dist*Math.sin(angle)+this.yPosition();
			this.gotoXY(X,Y);
			this.positionTalkBubble();
		}
    };
}());


//# sourceURL=translate_percent.js