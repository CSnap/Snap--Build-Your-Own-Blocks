SpriteMorph.flippedY = false;
SpriteMorph.flippedX = false;
Costume.colored = false;
var originalContent, ID;
var FirstCostume = true;



IDE_Morph.prototype.openProjectString = function (str) {
    var msg,
        myself = this;
    this.nextSteps([
        function () {
            msg = myself.showMessage('Opening project...');
           
        },
        function () {
            myself.rawOpenProjectString(str);
        },
        function () {
            msg.destroy();
        },
        function () {
            // if (config.presentation)
            // { 
                myself.toggleAppMode(true);
                setTimeout(this.stage.fireGreenFlagEvent(),5000);
            // }
        }
    ]);
};


SpriteMorph.prototype.wearCostume = function (costume) {
	if(this.flippedY)
	{
		this.flipYAxis();
	}
	if(this.flippedX)
	{
		this.flipXAxis();
	}
    // check if we need to remove the existing 3D shape
    if (this.colorChange || (this.object && this.costume && costume != this.costume)) {
        this.object.remove(this.mesh);
        this.parent.changed(); // redraw stage
    }

    // check if we need to update the palatte
    var isFrom2D = (this.costume == null) || (this.costume && !this.costume.is3D),
        isTo2D = (costume == null) || (costume && !costume.is3D);
    this.updatesPalette = (isFrom2D != isTo2D);

    if (costume && costume.is3D) { // if (costume == null), that means a Turtle
        if (costume.geometry != null) {
            // we have loaded a 3D geometry already
            var color = new THREE.Color(this.color.r/255, 
                                        this.color.g/255, 
                                        this.color.b/255),
                material, mesh, sphere;

            if (costume.map) {
                if (costume.geometry instanceof THREE.PlaneGeometry) {
                    material = new THREE.MeshPhongMaterial({map: costume.map, side: THREE.DoubleSide});
                }
                else {
                    material = new THREE.MeshPhongMaterial({map: costume.map, color: color});
                }
            }
            else {
                material = new THREE.MeshLambertMaterial({color: color});
            }
            mesh = new THREE.Mesh(costume.geometry, material);
            costume.geometry.computeBoundingSphere();
            sphere = costume.geometry.boundingSphere; // THREE.Sphere
            mesh.position.set(-sphere.center.x, -sphere.center.y, -sphere.center.z);

            this.mesh = mesh;
            this.hide();
            this.object.add(this.mesh);
            this.parent.changed(); // redraw stage
        }
        else {
            // first time we load this geometry
            var loader = new THREE.JSONLoader(), myself = this;
            loader.load(costume.url, function(geometry) {
                var color = new THREE.Color(myself.color.r/255, 
                                            myself.color.g/255, 
                                            myself.color.b/255);
                var material = new THREE.MeshLambertMaterial({color: color}),
                    mesh = new THREE.Mesh(geometry, material),
                    sphere = geometry.boundingSphere; // THREE.Sphere
                mesh.position.set(-sphere.center.x, -sphere.center.y, -sphere.center.z);
                myself.mesh = mesh;

                myself.object = new THREE.Object3D();
                myself.object.add(myself.mesh);
                myself.object.position.x = myself.xPosition();
                myself.object.position.y = myself.yPosition();
                myself.object.position.z = 0;

                myself.hide(); // hide the 2D image
                myself.parent.scene.add(myself.object);
                myself.parent.changed(); // redraw stage

                costume.geometry = geometry;
            });
        }
        this.costume = costume;
    }
    else {
        var x = this.xPosition ? this.xPosition() : null,
        y = this.yPosition ? this.yPosition() : null,
        isWarped = this.isWarped;
		if (this.costume && this.costume.originalPixels && !FirstCostume) 
		{
			this.costume.contents.getContext('2d').putImageData(this.costume.originalPixels, 0, 0);
			this.costume.colored = false;
		}
        if (isWarped) {
            this.endWarp();
        }
        this.changed();
        this.costume = costume;
        this.drawNew();
        this.changed();
        if (isWarped) {
            this.startWarp();
        }
        if (x !== null) {
            this.silentGotoXY(x, y, true); // just me
        }
        if (this.positionTalkBubble) { // the stage doesn't talk
            this.positionTalkBubble();
        }
        this.version = Date.now();
    }

    if (this.updatesPalette) {
        var ide = this.parentThatIsA(IDE_Morph);
        if (ide) {
            ide.selectSprite(this);
        }
    }
	FirstCostume = false;
};
Costume.prototype.setColorWithParent = function(col, myParent) {
	var flipBackX = false, flipBackY = false;
	if(myParent.flippedY)
	{
		myParent.flipYAxis();
		flipBackY = true;
	}
	if(myParent.flippedX)
	{
		myParent.flipXAxis();
		flipBackX = true;
	}

	 if(!this.originalPixels) {
		this.originalPixels = this.contents.getContext('2d')
		   .getImageData(0, 0, this.contents.width,
			  this.contents.height);
	 }
	 if(!this.costumeColor) {
		this.costumeColor = new Color(255,255,255);
	 }

	 currentPixels = this.contents.getContext('2d')
		.getImageData(0, 0,
		   this.contents.width, this.contents.height);

	 if(col instanceof Color) {
		this.costumeColor = col;
	 }
	 else {
		var hsv = this.costumeColor.hsv();
		hsv[0] = Math.max(Math.min(+col || 0, 100), 0) / 100;
		hsv[1] = 1; // we gotta fix this at some time
		this.costumeColor.set_hsv.apply(this.costumeColor, hsv);
	 }

	 for(var I = 0, L = this.originalPixels.data.length; I < L; I += 4){
		if(currentPixels.data[I + 3] > 0){
		   // If it's not a transparent pixel
		   currentPixels.data[I] = this.originalPixels.
			  data[I] / 255 * this.costumeColor.r;
		   currentPixels.data[I + 1] = this.originalPixels.
			  data[I + 1] / 255 * this.costumeColor.g;
		   currentPixels.data[I + 2] = this.originalPixels.
			  data[I + 2] / 255 * this.costumeColor.b;
		}
	 }
	 this.contents.getContext('2d')
		.putImageData(currentPixels, 0, 0);
	if(flipBackY)
	{
		myParent.flipYAxis();
	}
	if(flipBackX)
	{
		myParent.flipXAxis();
	}
};
Costume.prototype.copy = function () {
    var canvas = newCanvas(this.extent()),
        cpy,
        ctx;

    ctx = canvas.getContext('2d');
    ctx.drawImage(this.contents, 0, 0);
    cpy = new Costume(canvas, this.name ? copy(this.name) : null);
	cpy.flippedX = this.flippedX;
	cpy.flippedY = this.flippedY;
	cpy.colored = this.colored;
	cpy.originalPixels = this.originalPixels;
    cpy.rotationCenter = this.rotationCenter.copy();
    return cpy;
};

//# sourceURL=code.js

StageMorph.prototype.fireGreenFlagEvent = function () {
    var procs = [],
        hats = [],
        ide = this.parentThatIsA(IDE_Morph),
        myself = this;

    this.children.concat(this).forEach(function (morph) {
        if (morph instanceof SpriteMorph || morph instanceof StageMorph) {
            hats = hats.concat(morph.allHatBlocksFor('__shout__go__'));
        }
    });
    hats.forEach(function (block) {
        procs.push(myself.threads.startProcess(
            block,
            myself.isThreadSafe
        ));
    });
    if (ide) {
        ide.controlBar.pauseButton.refresh();
    }
    return procs;
};