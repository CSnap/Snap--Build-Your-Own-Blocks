(function () {
    return function (width, height) {
        var xRadius = width/2, yRadius = height, x=width/2, y=0, oldx, oldy, length=0;
        for (var theta = 0; theta <= Math.PI; theta += (Math.PI/360)) {
            oldx=x;
            oldy=y;
            x = xRadius * Math.cos(theta);
            y = yRadius * Math.sin(theta);
            length += Math.pow(Math.pow(x-oldx,2)+Math.pow(y-oldy,2),0.5);
        }
        return length;
    };
}());


 //# sourceURL=parabolaSegmentLength.js