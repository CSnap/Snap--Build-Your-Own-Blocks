(function () {
    return function () {
        var x = this.camera.position.x, z = this.camera.position.z,
            radius = Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2)),
            theta = Math.acos(z / radius);

        if (x < 0)
            theta = 2 * Math.PI - theta;
        
        return theta;
    };
}());


 //# sourceURL=_3DYCameraRotation.js