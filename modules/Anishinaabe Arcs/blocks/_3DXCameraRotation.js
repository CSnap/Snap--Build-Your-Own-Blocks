(function () {
    return function () {
        var y = this.camera.position.y, z = this.camera.position.z,
            radius = Math.sqrt(Math.pow(y, 2) + Math.pow(z, 2)),
            theta = Math.acos(z / radius);

        if (0 < y)
            theta = 2 * Math.PI - theta;
        
        return theta;
    };
}());


 //# sourceURL=_3DXCameraRotation.js