SpriteMorph._3DRotationX = 0, SpriteMorph._3DRotationY = 0, SpriteMorph._3DRotationZ = 0;
SpriteMorph.prototype.wearCostume = function (costume) {

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
            this.object.children = []
            this.object.add(this.mesh);
            this.parent.changed(); // redraw stage
        }
        else {
            // first time we load this geometry
            var loader = new THREE.JSONLoader(), myself = this;
			
            var geometry = loader.parse(eval("("+decodeURIComponent(costume.url.substring(15))+")")).geometry;
			var color = new THREE.Color(myself.color.r/255, 
										myself.color.g/255, 
										myself.color.b/255);
			var material = new THREE.MeshLambertMaterial({color: color}),
				mesh = new THREE.Mesh(geometry, material),
				sphere = geometry.boundingSphere; // THREE.Sphere
			mesh.position.set(-sphere.center.x, -sphere.center.y, -sphere.center.z);
			myself.mesh = mesh;
			if(!myself.object)
				myself.object = new THREE.Object3D();
			
			myself.object.add(myself.mesh);
			myself.object.position.x = myself.xPosition();
			myself.object.position.y = myself.yPosition();
			myself.object.position.z = myself.zPosition();

			myself.hide(); // hide the 2D image
			myself.parent.scene.add(myself.object);
			myself.parent.changed(); // redraw stage

			costume.geometry = geometry;
        }
        this.costume = costume;
    }
    else {
        var x = this.xPosition ? this.xPosition() : null,
        y = this.yPosition ? this.yPosition() : null,
        isWarped = this.isWarped;
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
};

SpriteMorph.prototype.turn3D = function (degX, degY, degZ) {
	if(!this.object)
		this.object = new THREE.Object3D()
	var fullQuaternion = new THREE.Quaternion(), quaternionX = new THREE.Quaternion(), quaternionY = new THREE.Quaternion(), quaternionZ = new THREE.Quaternion();
	quaternionX.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), radians(degX) );
	quaternionY.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), radians(degY) );
	quaternionZ.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), -radians(degZ) );

	this._3DRotationX += degX;
	this._3DRotationY += degY;
	this._3DRotationZ += degZ;

	fullQuaternion.multiplyQuaternions(quaternionZ,quaternionY.multiplyQuaternions(quaternionY,quaternionX.multiplyQuaternions(quaternionX,this.object.quaternion)));

	this.object.quaternion.copy(fullQuaternion);
	this.parent.changed();
};

SpriteMorph.prototype.point3D = function (degX, degY, degZ) {
	if(!this.object)
		this.object = new THREE.Object3D()
	var fullQuaternion = new THREE.Quaternion(), quaternionX = new THREE.Quaternion(), quaternionY = new THREE.Quaternion(), quaternionZ = new THREE.Quaternion();
	quaternionX.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), radians(degX) );
	quaternionY.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), radians(degY) );
	quaternionZ.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), -radians(degZ) );

	fullQuaternion.multiplyQuaternions(quaternionZ,quaternionY.multiplyQuaternions(quaternionY,quaternionX));

	this.object.quaternion.copy(fullQuaternion);

	this._3DRotationX = degX;
	this._3DRotationY = degY;
	this._3DRotationZ = degZ;

	this.parent.changed();
}

SpriteMorph.prototype.gotoXYZ = function (x, y, z, justMe) {
    if (this.object) {
        this.gotoXY(x,y, justMe);
        this.object.position.x = x;
        this.object.position.y = y;
        this.object.position.z = z;
        this.parent.changed();
    }
	else{
		this.object = new THREE.Object3D();
        this.gotoXY(x,y, justMe);
        this.object.position.x = x;
        this.object.position.y = y;
        this.object.position.z = z;
        this.parent.changed();
		
	}
}
function round10(val,exp)
{
	var pow = Math.pow(10,exp);
	return Math.round(val/pow)*pow;
}
IDE_Morph.prototype.droppedText = function (aString, name) {
    var lbl = name ? name.split('.')[0] : '';
    if (aString.indexOf('<project') === 0) {
        return this.openProjectString(aString);
    }
    if (aString.indexOf('<snapdata') === 0) {
        return this.openCloudDataString(aString);
    }
    if (aString.indexOf('<blocks') === 0) {
        return this.openBlocksString(aString, lbl, true);
    }
    if (aString.indexOf('<sprites') === 0) {
        return this.openSpritesString(aString);
    }
    if (aString.indexOf('<media') === 0) {
        return this.openMediaString(aString);
    }
    if (aString.indexOf('<3DCostume>') === 0) {
        return this.dropped3dObject(name, 'data:text/json,'+encodeURIComponent(aString.substring(11)));
    }
};
Costume.prototype.toXML = function (serializer) {
    if(this.originalPixels) {
        this.contents.getContext('2d').putImageData(this.originalPixels, 0, 0);
    }
    if(!this.costumeColor) {
        this.costumeColor = new Color(255,255,255);
    }
    serialized = serializer.format(
        '<costume name="@" center-x="@" center-y="@" costume-color="@,@,@" image="@" is3D="@" ~/>',
        this.name,
        this.rotationCenter.x,
        this.rotationCenter.y,
        this.costumeColor.r,
        this.costumeColor.g,
        this.costumeColor.b,
        this.is3D ? this.url :
            this instanceof SVG_Costume ?
                    this.contents.src : this.contents.toDataURL('image/png'),
        this.is3D
    );
    if(this.originalPixels) {
        this.setColor(this.costumeColor);
    }
    return serialized;
};

SnapSerializer.prototype.loadValue = function (model) {
    // private
    var v, items, el, center, image, name, audio, option,
        myself = this;

    function record() {
        if (Object.prototype.hasOwnProperty.call(
                model.attributes,
                'id'
            )) {
            myself.objects[model.attributes.id] = v;
        }
        if (Object.prototype.hasOwnProperty.call(
                model.attributes,
                'mediaID'
            )) {
            myself.mediaDict[model.attributes.mediaID] = v;
        }
    }
    switch (model.tag) {
    case 'ref':
        if (Object.prototype.hasOwnProperty.call(model.attributes, 'id')) {
            return this.objects[model.attributes.id];
        }
        if (Object.prototype.hasOwnProperty.call(
                model.attributes,
                'mediaID'
            )) {
            return this.mediaDict[model.attributes.mediaID];
        }
        throw new Error('expecting a reference id');
    case 'l':
        option = model.childNamed('option');
        return option ? [option.contents] : model.contents;
    case 'bool':
        return model.contents === 'true';
    case 'list':
        if (model.attributes.hasOwnProperty('linked')) {
            items = model.childrenNamed('item');
            if (items.length === 0) {
                v = new List();
                record();
                return v;
            }
            items.forEach(function (item) {
                var value = item.children[0];
                if (v === undefined) {
                    v = new List();
                    record();
                } else {
                    v = v.rest = new List();
                }
                v.isLinked = true;
                if (!value) {
                    v.first = 0;
                } else {
                    v.first = myself.loadValue(value);
                }
            });
            return v;
        }
        v = new List();
        record();
        v.contents = model.childrenNamed('item').map(function (item) {
            var value = item.children[0];
            if (!value) {
                return 0;
            }
            return myself.loadValue(value);
        });
        return v;
    case 'sprite':
        v  = new SpriteMorph(myself.project.globalVariables);
        if (model.attributes.id) {
            myself.objects[model.attributes.id] = v;
        }
        if (model.attributes.name) {
            v.name = model.attributes.name;
            myself.project.sprites[model.attributes.name] = v;
        }
        if (model.attributes.idx) {
            v.idx = +model.attributes.idx;
        }
        if (model.attributes.color) {
            v.color = myself.loadColor(model.attributes.color);
        }
        if (model.attributes.pen) {
            v.penPoint = model.attributes.pen;
        }
        myself.project.stage.add(v);
        v.scale = parseFloat(model.attributes.scale || '1');
        v.rotationStyle = parseFloat(
            model.attributes.rotation || '1'
        );
        v.isDraggable = model.attributes.draggable !== 'false';
        v.isVisible = model.attributes.hidden !== 'true';
        v.heading = parseFloat(model.attributes.heading) || 0;
        if(model.attributes.xRotation && model.attributes.yRotation && model.attributes.zRotation) v.point3D(model.attributes.xRotation || 0, model.attributes.yRotation || 0, model.attributes.zRotation || 0)
        v.drawNew();
        v.gotoXY(+model.attributes.x || 0, +model.attributes.y || 0);
		if(model.attributes.z) v.gotoXYZ(+model.attributes.x || 0, +model.attributes.y || 0, +model.attributes.z || 0);
        myself.loadObject(v, model);
        return v;
    case 'context':
        v = new Context(null);
        record();
        el = model.childNamed('script');
        if (el) {
            v.expression = this.loadScript(el);
        } else {
            el = model.childNamed('block') ||
                model.childNamed('custom-block');
            if (el) {
                v.expression = this.loadBlock(el);
            } else {
                el = model.childNamed('l');
                if (el) {
                    v.expression = new InputSlotMorph(el.contents);
                }
            }
        }
        el = model.childNamed('receiver');
        if (el) {
            el = el.childNamed('ref') || el.childNamed('sprite');
            if (el) {
                v.receiver = this.loadValue(el);
            }
        }
        el = model.childNamed('inputs');
        if (el) {
            el.children.forEach(function (item) {
                if (item.tag === 'input') {
                    v.inputs.push(item.contents);
                }
            });
        }
        el = model.childNamed('variables');
        if (el) {
            this.loadVariables(v.variables, el);
        }
        el = model.childNamed('context');
        if (el) {
            v.outerContext = this.loadValue(el);
        }
        return v;
    case 'costume':
        center = new Point();
        if (Object.prototype.hasOwnProperty.call(
                model.attributes,
                'center-x'
            )) {
            center.x = parseFloat(model.attributes['center-x']);
        }
        if (Object.prototype.hasOwnProperty.call(
                model.attributes,
                'center-y'
            )) {
            center.y = parseFloat(model.attributes['center-y']);
        }
        if (Object.prototype.hasOwnProperty.call(
                model.attributes,
                'name'
            )) {
            name = model.attributes.name;
        }
        if (model.attributes['costume-color']) {
            costumeColor = myself.loadColor(model.attributes['costume-color']);
        }
        else {
            costumeColor = new Color(255,255,255);
        }
        if (Object.prototype.hasOwnProperty.call(
                model.attributes,
                'image'
            )) {
            image = new Image();
            if (model.attributes.image.indexOf('data:image/svg+xml') === 0
                    && !MorphicPreferences.rasterizeSVGs) {
                v = new SVG_Costume(null, name, center);
                v.costumeColor = costumeColor;
                image.onload = function () {
                    v.contents = image;
                    v.setColor(v.costumeColor);
                    v.version = +new Date();
                    if (typeof v.loaded === 'function') {
                        v.loaded();
                    } else {
                        v.loaded = true;
                    }
                };
            }
			else if (Object.prototype.hasOwnProperty.call(model.attributes,'is3D') && model.attributes.is3D == "true"){
				v = new Costume(
					null, // no canvas for 3D costumes
					name ? name.split('.')[0] : '', // up to period
					null, // rotation center
					model.attributes.image,
					true, // is3D
					false // is3dSwitchable
				);
			}
			else {
                v = new Costume(null, name, center);
                v.costumeColor = costumeColor;
                image.onload = function () {
                    var canvas = newCanvas(
                            new Point(image.width, image.height)
                        ),
                        context = canvas.getContext('2d');
                    context.drawImage(image, 0, 0);
                    v.contents = canvas;
                    v.setColor(v.costumeColor);
                    v.version = +new Date();
                    if (typeof v.loaded === 'function') {
                        v.loaded();
                    } else {
                        v.loaded = true;
                    }
                };
            }
            image.src = model.attributes.image;
        }
        record();
        return v;
    case 'sound':
        audio = new Audio();
        audio.src = model.attributes.sound;
        v = new Sound(audio, model.attributes.name);
        if (Object.prototype.hasOwnProperty.call(
                model.attributes,
                'mediaID'
            )) {
            myself.mediaDict[model.attributes.mediaID] = v;
        }
        record();
        return v;
    }
    return undefined;
};

SpriteMorph.prototype.toXML = function (serializer) {
    var stage = this.parentThatIsA(StageMorph),
        ide = stage ? stage.parentThatIsA(IDE_Morph) : null,
        idx = ide ? ide.sprites.asArray().indexOf(this) + 1 : 0;
    return serializer.format(
        '<sprite name="@" idx="@" x="@" y="@" z="@"' +
            ' heading="@" xRotation="@" yRotation="@" zRotation="@"' +
            ' scale="@"' +
            ' rotation="@"' +
            ' draggable="@"' +
            '%' +
            ' costume="@" color="@,@,@" pen="@" ~>' +
            '%' + // nesting info
            '<costumes>%</costumes>' +
            '<sounds>%</sounds>' +
            '<variables>%</variables>' +
            '<blocks>%</blocks>' +
            '<scripts>%</scripts>' +
            '</sprite>',
        this.name,
        idx,
        this.xPosition(),
        this.yPosition(),
        this.zPosition(),
        this.heading,
        this._3DRotationX,
        this._3DRotationY,
        this._3DRotationZ,
        this.scale,
        this.rotationStyle,
        this.isDraggable,
        this.isVisible ? '' : ' hidden="true"',
        this.getCostumeIdx(),
        this.color.r,
        this.color.g,
        this.color.b,
        this.penPoint,

        // nesting info
        this.anchor
            ? '<nest anchor="' +
                    this.anchor.name +
                    '" synch="'
                    + this.rotatesWithAnchor
                    + (this.scale === this.nestingScale ? '' :
                            '"'
                            + ' scale="'
                            + this.nestingScale)

                    + '"/>'
            : '',

        serializer.store(this.costumes, this.name + '_cst'),
        serializer.store(this.sounds, this.name + '_snd'),
        serializer.store(this.variables),
        !this.customBlocks ?
                    '' : serializer.store(this.customBlocks),
        serializer.store(this.scripts)
    );
};

IDE_Morph.prototype.projectMenu = function () {
    var menu,
        myself = this,
        world = this.world(),
        pos = this.controlBar.projectButton.bottomLeft(),
        graphicsName = this.currentSprite instanceof SpriteMorph ?
                'Costumes' : 'Backgrounds',
        shiftClicked = (world.currentKey === 16);

    menu = new MenuMorph(this);
    menu.addItem('Project notes...', 'editProjectNotes');
    menu.addLine();
    menu.addItem(
        'New',
        function () {
            myself.confirm(
                'Replace the current project with a new one?',
                'New Project',
                function () {
                    myself.newProject();
                }
            );
        }
    );
    menu.addItem('Open...', 'openProjectsBrowser');
    menu.addItem(
        'Save',
        function () {
            if (myself.source === 'examples') {
                myself.source = 'local'; // cannot save to examples
            }
            if (myself.projectName) {
                if (myself.source === 'local') { // as well as 'examples'
                    myself.saveProject(myself.projectName);
                } else { // 'cloud'
                    myself.saveProjectToCloud(myself.projectName);
                }
            } else {
                myself.saveProjectsBrowser();
            }
        }
    );
    if (shiftClicked) {
        menu.addItem(
            'Save to disk',
            'saveProjectToDisk',
            'experimental - store this project\nin your downloads folder',
            new Color(100, 0, 0)
        );
    }
    menu.addItem('Save As...', 'saveProjectsBrowser');
    menu.addLine();
    menu.addItem(
        'Import...',
        function () {
            var inp = document.createElement('input');
            if (myself.filePicker) {
                document.body.removeChild(myself.filePicker);
                myself.filePicker = null;
            }
            inp.type = 'file';
            inp.style.color = "transparent";
            inp.style.backgroundColor = "transparent";
            inp.style.border = "none";
            inp.style.outline = "none";
            inp.style.position = "absolute";
            inp.style.top = "0px";
            inp.style.left = "0px";
            inp.style.width = "0px";
            inp.style.height = "0px";
            inp.addEventListener(
                "change",
                function () {
                    document.body.removeChild(inp);
                    myself.filePicker = null;
                    world.hand.processDrop(inp.files);
                },
                false
            );
            document.body.appendChild(inp);
            myself.filePicker = inp;
            inp.click();
        },
        'file menu import hint' // looks up the actual text in the translator
    );

    menu.addItem(
        shiftClicked ?
                'Export project as plain text...' : 'Export project...',
        function () {
            if (myself.projectName) {
                myself.exportProject(myself.projectName, shiftClicked);
            } else {
                myself.prompt('Export Project As...', function (name) {
                    myself.exportProject(name);
                }, null, 'exportProject');
            }
        },
        'show project data as XML\nin a new browser window',
        shiftClicked ? new Color(100, 0, 0) : null
    );

    menu.addItem(
        'Export blocks...',
        function () {myself.exportGlobalBlocks(); },
        'show global custom block definitions as XML\nin a new browser window'
    );

    menu.addLine();
    menu.addItem(
        'Import tools',
        function () {
            myself.droppedText(
                myself.getURL(
                    'http://community.csdt.rpi.edu/csnapsource/tools.xml'
                ),
                'tools'
            );
        },
        'load the official library of\npowerful blocks'
    );
    menu.addItem(
        'Libraries...',
        function () {
            // read a list of libraries from an external file,
            var libMenu = new MenuMorph(this, 'Import library'),
                libUrl = 'http://community.csdt.rpi.edu/csnapsource/libraries/' +
                    'LIBRARIES';

            function loadLib(name) {
                var url = 'http://community.csdt.rpi.edu/csnapsource/libraries/'
                        + name
                        + '.xml';
                myself.droppedText(myself.getURL(url), name);
            }

            myself.getURL(libUrl).split('\n').forEach(function (line) {
                if (line.length > 0) {
                    libMenu.addItem(
                        line.substring(line.indexOf('\t') + 1),
                        function () {
                            loadLib(
                                line.substring(0, line.indexOf('\t'))
                            );
                        }
                    );
                }
            });

            libMenu.popup(world, pos);
        },
        'Select categories of additional blocks to add to this project.'
    );
    
    menu.addLine();
    menu.addItem(
        'Load Demos...',
        function () { new ProjectDialogMorph(this, 'demos').popUp();},
        'show different default scripts'
    );

    if (this.currentSprite instanceof SpriteMorph) {
        // SpriteMorph
        menu.addItem(
            '2D ' + localize(graphicsName) + '...',
            function () {
                var dir = graphicsName,
                names = myself.getCostumesList(dir),
                libMenu = new MenuMorph(
                    myself,
                    localize('Import') + ' ' + '2D ' + localize(graphicsName)
                );

                function loadCostume(name) {
                    var url = dir + '/' + name,
                    img = new Image();
                    img.onload = function () {
                        var canvas = newCanvas(new Point(img.width, img.height));
                        canvas.getContext('2d').drawImage(img, 0, 0);
                        myself.droppedImage(canvas, name, img.src);
                    };
                    img.src = url;
                }

                names.forEach(function (line) {
                    if (line.length > 0) {
                        libMenu.addItem(
                            line,
                            function () {loadCostume(line); }
                        );
                    }
                });
                libMenu.popup(world, pos);
            },
            'Select a 2D costume from the media library'
        );

        menu.addItem(
            '3D ' + localize(graphicsName) + '...',
            function () {
                var dir = config.asset_path + graphicsName + '3D',
                names = myself.getCostumesList(dir+'/list.html'),
                libMenu = new MenuMorph(
                    myself,
                    localize('Import') + ' ' + '3D ' + localize(graphicsName)
                );

                function loadCostume(name) {
                    var url = dir + '/' + name;
                    request = new XMLHttpRequest();
                    try {
                        request.open('GET', url, false);
                        request.send();
                        if (request.status === 200) {
                        myself.dropped3dObject(name, 'data:text/json,'+encodeURIComponent(request.responseText));
                        }
                    }
                    catch(e){}

  
                }

                names.forEach(function (line) {
                    if (line.length > 0) {
                        libMenu.addItem(
                            line,
                            function () {loadCostume(line); }
                        );
                    }
                });
                libMenu.popup(world, pos);
            },
            'Select a 3D costume from the media library'
        );

        menu.addItem(
            'Textures...', // TODO: localize this 
            function () {
                var dir = 'Textures',
                names = myself.getTexturesList(dir),
                libMenu = new MenuMorph(
                    myself,
                    localize('Import') + ' ' + dir 
                );

                function loadTexture(name) {
                    var url = dir + '/' + name;
                    myself.droppedTexture(name, url);   
                }

                names.forEach(function (line) {
                    if (line.length > 0) {
                        libMenu.addItem(
                            line,
                            function () {loadTexture(line); }
                        );
                    }
                });
                libMenu.popup(world, pos);
            },
            'Select a texture from the media library'
        );
            
            
    }
    else {
        // StageMorph
        menu.addItem(
            localize(graphicsName) + '...',
            function () {
                var dir = graphicsName,
                names = myself.getCostumesList(dir),
                libMenu = new MenuMorph(
                    myself,
                    localize('Import') + ' ' + localize(dir)
                );

                function loadCostume(name) {
                    var url = dir + '/' + name,
                    img = new Image();
                    img.onload = function () {
                        var canvas = newCanvas(new Point(img.width, img.height));
                        canvas.getContext('2d').drawImage(img, 0, 0);
                        myself.droppedImage(canvas, name);
                    };
                    img.src = url;
                }

                names.forEach(function (line) {
                    if (line.length > 0) {
                        libMenu.addItem(
                            line,
                            function () {loadCostume(line); }
                        );
                    }
                });
                libMenu.popup(world, pos);
            },
            'Select a 2D costume from the media library'
        );
    }
    menu.addItem(
        localize('Sounds') + '...',
        function () {
            var names = this.getCostumesList('Sounds'),
                libMenu = new MenuMorph(this, 'Import sound');

            function loadSound(name) {
                var url = 'Sounds/' + name,
                    audio = new Audio();
                audio.src = url;
                audio.load();
                myself.droppedAudio(audio, name);
            }

            names.forEach(function (line) {
                if (line.length > 0) {
                    libMenu.addItem(
                        line,
                        function () {loadSound(line); }
                    );
                }
            });
            libMenu.popup(world, pos);
        },
        'Select a sound from the media library'
    );

    menu.popup(world, pos);
};

SpriteMorph.prototype.zPosition = function () {
    return  (this.object) ? this.object.position.z : 0;
}
//# sourceURL=code.js