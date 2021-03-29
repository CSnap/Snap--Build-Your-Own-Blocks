(function () {
    return function () {
        this.coordPlane = null;
        for (var i = 0; i < this.scene.children.length; i++)
        {
            if (this.scene.children[i].name == "coordinate plane"){
              var rest = this.scene.children.slice(i + 1 || this.scene.children.length);
              this.scene.children.pop();
              this.scene.children.push.apply(this.scene.children, rest);
            }
        }
        this.camera.lookAt({x:0, y:0, z:0});
        this.changed();
    };
}());


 //# sourceURL=hidePlane.js