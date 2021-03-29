(function () {
    return function (distance, direction) {
        var x = 0, y = 0, z = 0, tempXSign = 0, tempYSign = 0, tempZSign = 0, planarDistance = 0;
        var xRotation = (this._3DRotationX*Math.PI/180)%(2*Math.PI), yRotation = (this._3DRotationY*Math.PI/180)%(2*Math.PI), zRotation = (this._3DRotationZ*Math.PI/180)%(2*Math.PI), currentRotation = 0;
        var sign = distance?distance<0?-1:1:1;
		
        // set the initial direction
        if(direction === 'height') {
          y = distance;
          xRotation += Math.PI/2;
        } else if(direction === 'width'){
          x = distance;
        }else {
          z = distance;
          yRotation += Math.PI/2;
        }

        // rotate around the x axis
        planarDistance = Math.sqrt(Math.pow(y,2)+Math.pow(z,2));
        y = round10(Math.sin(xRotation) * planarDistance,-5);
        z = round10(Math.cos(xRotation) * planarDistance,-5);
        tempYSign = y?y<0?-1:1:1;
        tempZSign = z?z<0?-1:1:1;

        // rotate around the y axis
        planarDistance = Math.sqrt(Math.pow(x,2)+Math.pow(z,2));
        z = round10(Math.sin(yRotation) * planarDistance * tempZSign,-5);
        x = round10(Math.cos(yRotation) * planarDistance,-5);
        tempZSign = z?z<0?-1:1:1;
        tempXSign = x?x<0?-1:1:1;

        // roate around the z axis
        if(x != 0)
        {
	        currentRotation = Math.atan(y/x);
        }
        else
        {
        	if(y>0)
        	{
        		currentRotation = tempYSign*Math.PI/2;
        	}
        	else
        	{
        		currentRotation = 0
        	}
        }
        planarDistance = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
        x = round10(Math.cos(currentRotation + zRotation) * planarDistance * tempXSign,-5);
        y = round10(Math.sin(currentRotation + zRotation) * planarDistance * tempYSign,-5);
        
		//allow for negative motion
		x = x*sign;
        y = y*sign;
        z = -z*sign;

        this.gotoXYZ(x + this.object.position.x,y +this.object.position.y,z+this.object.position.z);
        this.positionTalkBubble();
    };
}());


 //# sourceURL=TranslateBy.js