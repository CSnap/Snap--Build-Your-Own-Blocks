SpriteMorph._3DRotationX = 0, SpriteMorph._3DRotationY = 0, SpriteMorph._3DRotationZ = 0, window.StageSTLURL = null;

// StageMorph 3D rendering
const THREEJS_FIELD_OF_VIEW = 45; // degree
const THREEJS_CAMERA_DEFAULT_X_POSITION = 350;
const THREEJS_CAMERA_DEFAULT_Y_POSITION = -350;
const THREEJS_CAMERA_DEFAULT_Z_POSITION = 350;

StageMorph.prototype.coordPlane = null;
SyntaxElementMorph.prototype.labelPart = function(spec) {
  var part, tokens;
  if (spec[0] === '%' &&
    spec.length > 1 &&
    this.selector !== 'reportGetVar') {
    // check for variable multi-arg-slot:
    if ((spec.length > 5) && (spec.slice(0, 5) === '%mult')) {
      part = new MultiArgMorph(spec.slice(5));
      part.addInput();
      return part;
    }

    // single-arg and specialized multi-arg slots:
    switch (spec) {
      case '%inputs':
        part = new MultiArgMorph('%s', 'with inputs');
        part.isStatic = false;
        part.canBeEmpty = false;
        break;
      case '%scriptVars':
        part = new MultiArgMorph('%t', null, 1, spec);
        part.canBeEmpty = false;
        break;
      case '%parms':
        part = new MultiArgMorph('%t', 'Input Names:', 0, spec);
        part.canBeEmpty = false;
        break;
      case '%ringparms':
        part = new MultiArgMorph(
          '%t',
          'input names:',
          0,
          spec
        );
        break;
      case '%cmdRing':
        part = new RingMorph();
        part.color = SpriteMorph.prototype.blockColor.other;
        part.selector = 'reifyScript';
        part.setSpec('%rc %ringparms');
        part.isDraggable = true;
        break;
      case '%repRing':
        part = new RingMorph();
        part.color = SpriteMorph.prototype.blockColor.other;
        part.selector = 'reifyReporter';
        part.setSpec('%rr %ringparms');
        part.isDraggable = true;
        part.isStatic = true;
        break;
      case '%predRing':
        part = new RingMorph(true);
        part.color = SpriteMorph.prototype.blockColor.other;
        part.selector = 'reifyPredicate';
        part.setSpec('%rp %ringparms');
        part.isDraggable = true;
        part.isStatic = true;
        break;
      case '%words':
        part = new MultiArgMorph('%s', null, 0);
        part.addInput(); // allow for default value setting
        part.addInput(); // allow for default value setting
        part.isStatic = false;
        break;
      case '%exp':
        part = new MultiArgMorph('%s', null, 0);
        part.addInput();
        part.isStatic = true;
        part.canBeEmpty = false;
        break;
      case '%br':
        part = new Morph();
        part.setExtent(new Point(0, 0));
        part.isBlockLabelBreak = true;
        part.getSpec = function() {
          return '%br';
        };
        break;
      case '%inputName':
        part = new ReporterBlockMorph();
        part.category = 'variables';
        part.color = SpriteMorph.prototype.blockColor.variables;
        part.setSpec(localize('Input name'));
        break;
      case '%s':
        part = new InputSlotMorph();
        break;
      case '%anyUE':
        part = new InputSlotMorph();
        part.isUnevaluated = true;
        break;
      case '%txt':
        part = new InputSlotMorph();
        part.minWidth = part.height() * 1.7; // "landscape"
        part.fixLayout();
        break;
      case '%mlt':
        part = new TextSlotMorph();
        part.fixLayout();
        break;
      case '%code':
        part = new TextSlotMorph();
        part.contents().fontName = 'monospace';
        part.contents().fontStyle = 'monospace';
        part.fixLayout();
        break;
      case '%obj':
        part = new ArgMorph('object');
        break;
      case '%n':
        part = new InputSlotMorph(null, true);
        break;
      case '%dir':
        part = new InputSlotMorph(
          null,
          true, {
            '(90) right': 90,
            '(-90) left': -90,
            '(0) up': '0',
            '(180) down': 180
          }
        );
        part.setContents(90);
        break;
      case '%inst':
        part = new InputSlotMorph(
          null,
          true, {
            '(1) Acoustic Grand': 1,
            '(2) Bright Acoustic': 2,
            '(3) Electric Grand': 3,
            '(4) Honky Tonk': 4,
            '(5) Electric Piano 1': 5,
            '(6) Electric Piano 2': 6,
            '(7) Harpsichord': 7
          }
        );
        part.setContents(1);
        break;
      case '%month':
        part = new InputSlotMorph(
          null, // text
          false, // numeric?
          {
            'January': ['January'],
            'February': ['February'],
            'March': ['March'],
            'April': ['April'],
            'May': ['May'],
            'June': ['June'],
            'July': ['July'],
            'August': ['August'],
            'September': ['September'],
            'October': ['October'],
            'November': ['November'],
            'December': ['December']
          },
          true // read-only
        );
        break;
      case '%dates':
        part = new InputSlotMorph(
          null, // text
          false, // non-numeric
          {
            'year': ['year'],
            'month': ['month'],
            'date': ['date'],
            'day of week': ['day of week'],
            'hour': ['hour'],
            'minute': ['minute'],
            'second': ['second'],
            'time in milliseconds': ['time in milliseconds']
          },
          true // read-only
        );
        part.setContents(['date']);
        break;
      case '%delim':
        part = new InputSlotMorph(
          null, // text
          false, // numeric?
          {
            'whitespace': ['whitespace'],
            'line': ['line'],
            'tab': ['tab'],
            'cr': ['cr']
          },
          false // read-only
        );
        break;
      case '%ida':
        part = new InputSlotMorph(
          null,
          true, {
            '1': 1,
            last: ['last'],
            '~': null,
            all: ['all']
          }
        );
        part.setContents(1);
        break;
      case '%idx':
        part = new InputSlotMorph(
          null,
          true, {
            '1': 1,
            last: ['last'],
            any: ['any']
          }
        );
        part.setContents(1);
        break;
      case '%spr':
        part = new InputSlotMorph(
          null,
          false,
          'objectsMenu',
          true
        );
        break;
      case '%col': // collision detection
        part = new InputSlotMorph(
          null,
          false,
          'collidablesMenu',
          true
        );
        break;
      case '%dst': // distance measuring
        part = new InputSlotMorph(
          null,
          false,
          'distancesMenu',
          true
        );
        break;
      case '%cln': // clones
        part = new InputSlotMorph(
          null,
          false,
          'clonablesMenu',
          true
        );
        break;
      case '%cst':
        part = new InputSlotMorph(
          null,
          false,
          'costumesMenu',
          true
        );
        break;
      case '%eff':
        part = new InputSlotMorph(
          null,
          false, {
            /*
                color : 'color',
                fisheye : 'fisheye',
                whirl : 'whirl',
                pixelate : 'pixelate',
                mosaic : 'mosaic',
                brightness : 'brightness',
            */
            ghost: ['ghost']
          },
          true
        );
        part.setContents(['ghost']);
        break;
      case '%drc':
        if (this.costume && this.costume.is3D) {
          part = new InputSlotMorph(
            'width',
            false, {
              width: ['width'],
              height: ['height']
            },
            true
          );
        } else {
          part = new InputSlotMorph(
            'width',
            false, {
              width: ['width'],
              height: ['height'],
              depth: ['depth'],
            },
            true
          );
        }
        part.setContents(['width']);
        break;
      case '%snd':
        part = new InputSlotMorph(
          null,
          false,
          'soundsMenu',
          true
        );
        break;
      case '%key':
        part = new InputSlotMorph(
          null,
          false, {
            'up arrow': ['up arrow'],
            'down arrow': ['down arrow'],
            'right arrow': ['right arrow'],
            'left arrow': ['left arrow'],
            space: ['space'],
            a: ['a'],
            b: ['b'],
            c: ['c'],
            d: ['d'],
            e: ['e'],
            f: ['f'],
            g: ['g'],
            h: ['h'],
            i: ['i'],
            j: ['j'],
            k: ['k'],
            l: ['l'],
            m: ['m'],
            n: ['n'],
            o: ['o'],
            p: ['p'],
            q: ['q'],
            r: ['r'],
            s: ['s'],
            t: ['t'],
            u: ['u'],
            v: ['v'],
            w: ['w'],
            x: ['x'],
            y: ['y'],
            z: ['z'],
            '0': ['0'],
            '1': ['1'],
            '2': ['2'],
            '3': ['3'],
            '4': ['4'],
            '5': ['5'],
            '6': ['6'],
            '7': ['7'],
            '8': ['8'],
            '9': ['9']
          },
          true
        );
        part.setContents(['space']);
        break;
      case '%keyHat':
        part = this.labelPart('%key');
        part.isStatic = true;
        break;
      case '%msg':
        part = new InputSlotMorph(
          null,
          false,
          'messagesMenu',
          true
        );
        break;
      case '%msgHat':
        part = new InputSlotMorph(
          null,
          false,
          'messagesReceivedMenu',
          true
        );
        part.isStatic = true;
        break;
      case '%att':
        part = new InputSlotMorph(
          null,
          false,
          'attributesMenu',
          true
        );
        break;
      case '%fun':
        part = new InputSlotMorph(
          null,
          false, {
            abs: ['abs'],
            floor: ['floor'],
            sqrt: ['sqrt'],
            sin: ['sin'],
            cos: ['cos'],
            tan: ['tan'],
            asin: ['asin'],
            acos: ['acos'],
            atan: ['atan'],
            ln: ['ln'],
            // log : 'log',
            'e^': ['e^']
            // '10^' : '10^'
          },
          true
        );
        part.setContents(['sqrt']);
        break;
      case '%txtfun':
        part = new InputSlotMorph(
          null,
          false, {
            'encode URI': ['encode URI'],
            'decode URI': ['decode URI'],
            'encode URI component': ['encode URI component'],
            'decode URI component': ['decode URI component'],
            'XML escape': ['XML escape'],
            'XML unescape': ['XML unescape'],
            'hex sha512 hash': ['hex sha512 hash']
          },
          true
        );
        part.setContents(['encode URI']);
        break;
      case '%stopChoices':
        part = new InputSlotMorph(
          null,
          false, {
            'all': ['all'],
            'this script': ['this script'],
            'this block': ['this block']
          },
          true
        );
        part.setContents(['all']);
        part.isStatic = true;
        break;
      case '%stopOthersChoices':
        part = new InputSlotMorph(
          null,
          false, {
            'all but this script': ['all but this script'],
            'other scripts in sprite': ['other scripts in sprite']
          },
          true
        );
        part.setContents(['all but this script']);
        part.isStatic = true;
        break;
      case '%typ':
        part = new InputSlotMorph(
          null,
          false, {
            number: ['number'],
            text: ['text'],
            Boolean: ['Boolean'],
            list: ['list'],
            command: ['command'],
            reporter: ['reporter'],
            predicate: ['predicate']
            // ring : 'ring'
            // object : 'object'
          },
          true
        );
        part.setContents(['number']);
        break;
      case '%var':
        part = new InputSlotMorph(
          null,
          false,
          'getVarNamesDict',
          true
        );
        part.isStatic = true;
        break;
      case '%lst':
        part = new InputSlotMorph(
          null,
          false, {
            list1: 'list1',
            list2: 'list2',
            list3: 'list3'
          },
          true
        );
        break;
      case '%codeKind':
        part = new InputSlotMorph(
          null,
          false, {
            code: ['code'],
            header: ['header']
          },
          true
        );
        part.setContents(['code']);
        break;
      case '%l':
        part = new ArgMorph('list');
        break;
      case '%b':
      case '%boolUE':
        part = new BooleanSlotMorph(null, true);
        break;
      case '%cmd':
        part = new CommandSlotMorph();
        break;
      case '%rc':
        part = new RingCommandSlotMorph();
        part.isStatic = true;
        break;
      case '%rr':
        part = new RingReporterSlotMorph();
        part.isStatic = true;
        break;
      case '%rp':
        part = new RingReporterSlotMorph(true);
        part.isStatic = true;
        break;
      case '%c':
        part = new CSlotMorph();
        part.isStatic = true;
        break;
      case '%cs':
        part = new CSlotMorph(); // non-static
        break;
      case '%clr':
        part = new ColorSlotMorph();
        part.isStatic = true;
        break;
      case '%t':
        part = new TemplateSlotMorph('a');
        break;
      case '%upvar':
        part = new TemplateSlotMorph('\u2191'); // up-arrow
        break;
      case '%f':
        part = new FunctionSlotMorph();
        break;
      case '%r':
        part = new ReporterSlotMorph();
        break;
      case '%p':
        part = new ReporterSlotMorph(true);
        break;

        // code mapping (experimental)

      case '%codeListPart':
        part = new InputSlotMorph(
          null, // text
          false, // numeric?
          {
            'list': ['list'],
            'item': ['item'],
            'delimiter': ['delimiter']
          },
          true // read-only
        );
        break;
      case '%codeListKind':
        part = new InputSlotMorph(
          null, // text
          false, // numeric?
          {
            'collection': ['collection'],
            'variables': ['variables'],
            'parameters': ['parameters']
          },
          true // read-only
        );
        break;

        // symbols:

      case '%turtle':
        part = new SymbolMorph('turtle');
        part.size = this.fontSize * 1.2;
        part.color = new Color(255, 255, 255);
        part.shadowColor = this.color.darker(this.labelContrast);
        part.shadowOffset = MorphicPreferences.isFlat ?
          new Point() : this.embossing;
        part.drawNew();
        break;
      case '%turtleOutline':
        part = new SymbolMorph('turtleOutline');
        part.size = this.fontSize;
        part.color = new Color(255, 255, 255);
        part.isProtectedLabel = true; // doesn't participate in zebraing
        part.shadowColor = this.color.darker(this.labelContrast);
        part.shadowOffset = MorphicPreferences.isFlat ?
          new Point() : this.embossing;
        part.drawNew();
        break;
      case '%clockwise':
        part = new SymbolMorph('turnRight');
        part.size = this.fontSize * 1.5;
        part.color = new Color(255, 255, 255);
        part.isProtectedLabel = false; // zebra colors
        part.shadowColor = this.color.darker(this.labelContrast);
        part.shadowOffset = MorphicPreferences.isFlat ?
          new Point() : this.embossing;
        part.drawNew();
        break;
      case '%counterclockwise':
        part = new SymbolMorph('turnLeft');
        part.size = this.fontSize * 1.5;
        part.color = new Color(255, 255, 255);
        part.isProtectedLabel = false; // zebra colors
        part.shadowColor = this.color.darker(this.labelContrast);
        part.shadowOffset = MorphicPreferences.isFlat ?
          new Point() : this.embossing;
        part.drawNew();
        break;
      case '%greenflag':
        part = new SymbolMorph('flag');
        part.size = this.fontSize * 1.5;
        part.color = new Color(0, 200, 0);
        part.isProtectedLabel = true; // doesn't participate in zebraing
        part.shadowColor = this.color.darker(this.labelContrast);
        part.shadowOffset = MorphicPreferences.isFlat ?
          new Point() : this.embossing;
        part.drawNew();
        break;
      case '%stop':
        part = new SymbolMorph('octagon');
        part.size = this.fontSize * 1.5;
        part.color = new Color(200, 0, 0);
        part.isProtectedLabel = true; // doesn't participate in zebraing
        part.shadowColor = this.color.darker(this.labelContrast);
        part.shadowOffset = MorphicPreferences.isFlat ?
          new Point() : this.embossing;
        part.drawNew();
        break;
      case '%pause':
        part = new SymbolMorph('pause');
        part.size = this.fontSize;
        part.color = new Color(160, 80, 0);
        part.isProtectedLabel = true; // doesn't participate in zebraing
        part.shadowColor = this.color.darker(this.labelContrast);
        part.shadowOffset = MorphicPreferences.isFlat ?
          new Point() : this.embossing;
        part.drawNew();
        break;
      default:
        nop();
    }
  } else if (spec[0] === '$' &&
    spec.length > 1 &&
    this.selector !== 'reportGetVar') {
    /*
            // allow costumes as label symbols
            // has issues when loading costumes (asynchronously)
            // commented out for now

            var rcvr = this.definition.receiver || this.receiver(),
                id = spec.slice(1),
                cst;
            if (!rcvr) {return this.labelPart('%stop'); }
            cst = detect(
                rcvr.costumes.asArray(),
                function (each) {return each.name === id; }
            );
            part = new SymbolMorph(cst);
            part.size = this.fontSize * 1.5;
            part.color = new Color(255, 255, 255);
            part.isProtectedLabel = true; // doesn't participate in zebraing
            part.drawNew();
    */

    // allow GUI symbols as label icons
    // usage: $symbolName[-size-r-g-b], size and color values are optional
    tokens = spec.slice(1).split('-');
    if (!contains(SymbolMorph.prototype.names, tokens[0])) {
      part = new StringMorph(spec);
      part.fontName = this.labelFontName;
      part.fontStyle = this.labelFontStyle;
      part.fontSize = this.fontSize;
      part.color = new Color(255, 255, 255);
      part.isBold = true;
      part.shadowColor = this.color.darker(this.labelContrast);
      part.shadowOffset = MorphicPreferences.isFlat ?
        new Point() : this.embossing;
      part.drawNew();
      return part;
    }
    part = new SymbolMorph(tokens[0]);
    part.size = this.fontSize * (+tokens[1] || 1.2);
    part.color = new Color(+tokens[2] === 0 ? 0 : +tokens[2] || 255, +tokens[3] === 0 ? 0 : +tokens[3] || 255, +tokens[4] === 0 ? 0 : +tokens[4] || 255);
    part.isProtectedLabel = tokens.length > 2; // zebra colors
    part.shadowColor = this.color.darker(this.labelContrast);
    part.shadowOffset = MorphicPreferences.isFlat ?
      new Point() : this.embossing;
    part.drawNew();
  } else {
    part = new StringMorph(spec);
    part.fontName = this.labelFontName;
    part.fontStyle = this.labelFontStyle;
    part.fontSize = this.fontSize;
    part.color = new Color(255, 255, 255);
    part.isBold = true;
    part.shadowColor = this.color.darker(this.labelContrast);
    part.shadowOffset = MorphicPreferences.isFlat ?
      new Point() : this.embossing;
    part.drawNew();
  }
  return part;
};

SpriteMorph.prototype.wearCostume = function(costume) {

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
      // we have loaded a 3D geometry already already already
      var color = new THREE.Color(this.color.r / 255,
          this.color.g / 255,
          this.color.b / 255),
        material, mesh, sphere;

      if (costume.map) {
        if (costume.geometry instanceof THREE.PlaneGeometry) {
          material = new THREE.MeshPhongMaterial({
            map: costume.map,
            side: THREE.DoubleSide
          });
        } else {
          material = new THREE.MeshPhongMaterial({
            map: costume.map,
            color: color
          });
        }
      } else {
        material = new THREE.MeshLambertMaterial({
          color: color
        });
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
    } else {
      // first time we load this geometry
      var loader = new THREE.JSONLoader(),
        myself = this;
      loader.load(costume.url, function(geometry) {
        var color = new THREE.Color(myself.color.r / 255,
          myself.color.g / 255,
          myself.color.b / 255);
        var material = new THREE.MeshLambertMaterial({
            color: color
          }),
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
  } else {
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

SpriteMorph.prototype.turn3D = function(degX, degY, degZ) {
  if (this.costume && this.costume.is3D) {

    var fullQuaternion = new THREE.Quaternion(),
      quaternionX = new THREE.Quaternion(),
      quaternionY = new THREE.Quaternion(),
      quaternionZ = new THREE.Quaternion();
    quaternionX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), radians(degX));
    quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), radians(degY));
    quaternionZ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -radians(degZ));

    this._3DRotationX += degX;
    this._3DRotationY += degY;
    this._3DRotationZ += degZ;

    fullQuaternion.multiplyQuaternions(quaternionZ, quaternionY.multiplyQuaternions(quaternionY, quaternionX.multiplyQuaternions(quaternionX, this.object.quaternion)));

    this.object.quaternion.copy(fullQuaternion);
    this.parent.changed();
  }
};

// copy blocks over to stagemorph to allow camera rotation to work
var f = zip.file("blocks.json");
if (f != null) {
  var f_text = f.asText();
  var blockJSON = JSON.parse(f_text);
  for (var block in blockJSON) {
    StageMorph.prototype[block] = eval(zip.file("blocks/" + block + ".js").asText());
  }
}

SpriteMorph.prototype.point3D = function(degX, degY, degZ) {
  if (this.costume && this.costume.is3D) {

    var fullQuaternion = new THREE.Quaternion(),
      quaternionX = new THREE.Quaternion(),
      quaternionY = new THREE.Quaternion(),
      quaternionZ = new THREE.Quaternion();
    quaternionX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), radians(degX));
    quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), radians(degY));
    quaternionZ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -radians(degZ));

    fullQuaternion.multiplyQuaternions(quaternionZ, quaternionY.multiplyQuaternions(quaternionY, quaternionX));

    this.object.quaternion.copy(fullQuaternion);

    this._3DRotationX = degX;
    this._3DRotationY = degY;
    this._3DRotationZ = degZ;

    this.parent.changed();
  }
};

StageMorph.prototype.addCoordinatePlane = function() {
  var geometry, textGeometry, textShapes, grid, text, label, xaxis, yaxis, zaxis, material, object, size = 240,
    step = 25;

  geometry = new THREE.Geometry();
  textGeometry = new THREE.Geometry();
  material = new THREE.LineBasicMaterial({
    color: 'black'
  });
  object = new THREE.Object3D();

  function addLabel(x, y, z, label, lColor, lSize, rotation) {
    textShapes = THREE.FontUtils.generateShapes(label, {
      size: 16
    });
    text = new THREE.ShapeGeometry(textShapes);
    text.computeBoundingBox();
    text.computeVertexNormals();
    label = new THREE.Mesh(text, new THREE.MeshBasicMaterial({
      color: lColor
    }));
    label.material.side = THREE.DoubleSide;
    label.position = new THREE.Vector3(x, y, z);
    label.rotation.x = rotation;
    label.updateMatrix();
    object.add(label);
  }

  for (var i = -size; i <= size; i += step) {
    geometry.vertices.push(new THREE.Vector3(-size, i, -0.04));
    geometry.vertices.push(new THREE.Vector3(size, i, -0.04));
    geometry.vertices.push(new THREE.Vector3(i, -size, -0.04));
    geometry.vertices.push(new THREE.Vector3(i, size, -0.04));
  }

  for (var i = 0; i <= size * (2 / 3); i += step) {
    geometry.vertices.push(new THREE.Vector3(-12, 0, i));
    geometry.vertices.push(new THREE.Vector3(12, 0, i));
  }

  grid = new THREE.Line(geometry, material, THREE.LinePieces);

  object.add(grid);

  geometry = new THREE.Geometry();
  material = new THREE.LineBasicMaterial({
    linewidth: 5,
    linecap: 'round',
    color: 'red'
  });

  geometry.vertices.push(new THREE.Vector3(0, 0, -0.04));
  geometry.vertices.push(new THREE.Vector3(size, 0, -0.04));

  xaxis = new THREE.Line(geometry, material, THREE.LinePieces);

  object.add(xaxis);

  addLabel(size, 0, -0.04, 'X', 'red', 16, 0);

  geometry = new THREE.Geometry();
  material = new THREE.LineBasicMaterial({
    linewidth: 5,
    linecap: 'round',
    color: 'green'
  });

  geometry.vertices.push(new THREE.Vector3(0, 0, -0.04));
  geometry.vertices.push(new THREE.Vector3(0, size, -0.04));

  yaxis = new THREE.Line(geometry, material, THREE.LinePieces);

  object.add(yaxis);

  addLabel(0, size, -0.04, 'Y', 'green', 16, 0);

  geometry = new THREE.Geometry();
  material = new THREE.LineBasicMaterial({
    linewidth: 5,
    linecap: 'round',
    color: 'blue'
  });

  geometry.vertices.push(new THREE.Vector3(0, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, 0, size * (2 / 3)));

  zaxis = new THREE.Line(geometry, material, THREE.LinePieces);

  object.add(zaxis);

  addLabel(0, 0, size * (2 / 3), 'Z', 'blue', 16, Math.PI / 2);

  object.name = "coordinate plane";

  this.scene.add(object);
  this.changed();
};

this.ide.isAnimating = false;
this.ide.setStageExtent(new Point(600, 600));
this.ide.isAnimating = true;

StageMorph.prototype.init3D = function() {
  var canvas = this.get3dCanvas();

  var vFOV = THREEJS_FIELD_OF_VIEW;
  var dist = THREEJS_CAMERA_DEFAULT_Z_POSITION;
  var height =   2 * Math.tan( ( Math.PI / 180 ) * vFOV/ 2 ) * dist;
  var width = (canvas.width / canvas.height) * height;

  this.scene = new THREE.Scene();

  // camera
  this.camera = new THREE.PerspectiveCamera(vFOV,
    canvas.width / canvas.height, 0.1, 10000);
  this.camera.position.set(THREEJS_CAMERA_DEFAULT_X_POSITION,
    THREEJS_CAMERA_DEFAULT_Y_POSITION,
    THREEJS_CAMERA_DEFAULT_Z_POSITION);
  this.camera.lookAt({
    x: 0,
    y: 0,
    z: 0
  });
  pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(1, 1, 2);
  this.camera.add(pointLight);
  this.scene.add(this.camera);

  // lighting
  //

  // renderer
  // try {
  //     this.renderer = new THREE.WebGLRenderer({canvas: canvas});
  // } catch (e) {
  this.renderer = new THREE.CanvasRenderer({
    canvas: canvas
  });
  // }
  // EDIT ME TO CHANGE POSITION OF PLANE ORIGIN!!!!!	
  this.renderer.setSize((canvas.width / self.devicePixelRatio), (canvas.height / self.devicePixelRatio));
  
}

SpriteMorph.prototype.renderArc = function(width, height) {
  const THREEJS_ARC_SEGMENTS = 60,
    THREEJS_TUBE_SEGMENTS = THREEJS_ARC_SEGMENTS;
  var xRadius = width / 2,
    yRadius = height,
    y, z, points = new Array(),
    path,
    THREEJS_TUBE_RADIUS = this.penSize(),
    THREEJS_TUBE_RADIUS_SEGMENTS = this.penSize() + 4,
    geometry;

  for (var theta = 0; theta <= Math.PI; theta += (Math.PI / THREEJS_ARC_SEGMENTS)) {
    y = xRadius * Math.cos(theta);
    z = yRadius * Math.sin(theta);
    points.push(new THREE.Vector3(0, y, z));
  }
  path = new THREE.SplineCurve3(points);
  geometry = new THREE.TubeGeometry(path,
    THREEJS_TUBE_SEGMENTS,
    THREEJS_TUBE_RADIUS,
    THREEJS_TUBE_RADIUS_SEGMENTS,
    false); // closed or not
  this.render3dShape(geometry, false);
}

StageMorph.prototype.init = function(globals) {
  this.name = localize('Stage');
  this.threads = new ThreadManager();
  this.variables = new VariableFrame(globals || null, this);
  this.scripts = new ScriptsMorph(this);
  this.customBlocks = [];
  this.globalBlocks = [];
  this.costumes = new List();
  this.costume = null;
  this.sounds = new List();
  this.version = Date.now(); // for observers
  this.isFastTracked = false;
  this.cloneCount = 0;
  this.volume = 100;
  this.muted = false;

  this.timerStart = Date.now();
  this.tempo = 60; // bpm
  this.lastMessage = '';

  this.watcherUpdateFrequency = 2;
  this.lastWatcherUpdate = Date.now();

  this.scale = 1; // for display modes, do not persist

  this.keysPressed = {}; // for handling keyboard events, do not persist
  this.blocksCache = {}; // not to be serialized (!)
  this.paletteCache = {}; // not to be serialized (!)
  this.lastAnswer = null; // last user input, do not persist
  this.activeSounds = []; // do not persist

  this.trailsCanvas = null;
  this.isThreadSafe = false;

  StageMorph.uber.init.call(this);

  this.acceptsDrops = false;
  this.setColor(new Color(255, 255, 255));
  this.fps = this.frameRate;

  // 3D
  this.canvas3D = null;
  this.shownObjects = new List();
  this.hiddenObjects = new List();
  this.init3D();
  this.addCoordinatePlane();
  this.camera.up = new THREE.Vector3(0, 0, 1);
  this.camera.lookAt({
    x: 0,
    y: 0,
    z: 0
  });
};

// StageMorph block templates

StageMorph.prototype.blockTemplates = function(category) {
  var blocks = [],
    myself = this,
    varNames, button,
    cat = category || 'motion',
    txt;

  function block(selector) {
    if (myself.hiddenPrimitives[selector]) {
      return null;
    }
    var newBlock = SpriteMorph.prototype.blockForSelector(selector, true);
    newBlock.isTemplate = true;
    return newBlock;
  }

  function variableBlock(varName) {
    var newBlock = SpriteMorph.prototype.variableBlock(varName);
    newBlock.isDraggable = false;
    newBlock.isTemplate = true;
    return newBlock;
  }

  function watcherToggle(selector) {
    if (myself.hiddenPrimitives[selector]) {
      return null;
    }
    var info = SpriteMorph.prototype.blocks[selector];
    return new ToggleMorph(
      'checkbox',
      this,
      function() {
        myself.toggleWatcher(
          selector,
          localize(info.spec),
          myself.blockColor[info.category]
        );
      },
      null,
      function() {
        return myself.showingWatcher(selector);
      },
      null
    );
  }

  function variableWatcherToggle(varName) {
    return new ToggleMorph(
      'checkbox',
      this,
      function() {
        myself.toggleVariableWatcher(varName);
      },
      null,
      function() {
        return myself.showingVariableWatcher(varName);
      },
      null
    );
  }

  if (cat === 'motion') {

    txt = new TextMorph(localize(
      'Stage selected:\nno motion primitives'
    ));
    txt.fontSize = 9;
    txt.setColor(this.paletteTextColor);
    blocks.push(txt);

  } else if (cat === 'looks') {

    blocks.push(block('doSwitchToCostume'));
    blocks.push(block('doWearNextCostume'));
    blocks.push(watcherToggle('getCostumeIdx'));
    blocks.push(block('getCostumeIdx'));
    blocks.push('-');
    blocks.push(block('changeEffect'));
    blocks.push(block('setEffect'));
    blocks.push(block('clearEffects'));
    blocks.push('-');
    blocks.push(block('setCameraPosition'));
    blocks.push(block('changeCameraXPosition'));
    blocks.push(block('changeCameraYPosition'));
    blocks.push(block('changeCameraZPosition'));
    blocks.push(block('turnCameraAroundXAxis'));
    blocks.push(block('turnCameraAroundYAxis'));
    blocks.push(block('_3DXCameraRotation'));
    blocks.push(block('_3DYCameraRotation'));
    blocks.push(block('showPlane'));
    blocks.push(block('hidePlane'));

    // for debugging: ///////////////

    if (this.world().isDevMode) {
      blocks.push('-');
      txt = new TextMorph(localize(
        'development mode \ndebugging primitives:'
      ));
      txt.fontSize = 9;
      txt.setColor(this.paletteTextColor);
      blocks.push(txt);
      blocks.push('-');
      blocks.push(block('reportCostumes'));
      blocks.push('-');
      blocks.push(block('log'));
      blocks.push(block('alert'));
    }

    /////////////////////////////////

  } else if (cat === 'sound') {

    blocks.push(block('playSound'));
    blocks.push(block('doPlaySoundUntilDone'));
    blocks.push(block('doStopAllSounds'));
    blocks.push('-');
    blocks.push(block('doSetVolume'));
    blocks.push(block('doChangeVolume'));
    blocks.push(watcherToggle('reportVolume'));
    blocks.push(block('reportVolume'));
    blocks.push('-');
    blocks.push(block('doRest'));
    blocks.push('-');
    blocks.push(block('doPlayNote'));
    blocks.push('-');
    blocks.push(block('doChangeTempo'));
    blocks.push(block('doSetTempo'));
    blocks.push(watcherToggle('getTempo'));
    blocks.push(block('getTempo'));

    // for debugging: ///////////////

    if (this.world().isDevMode) {
      blocks.push('-');
      txt = new TextMorph(localize(
        'development mode \ndebugging primitives:'
      ));
      txt.fontSize = 9;
      txt.setColor(this.paletteTextColor);
      blocks.push(txt);
      blocks.push('-');
      blocks.push(block('reportSounds'));
    }

  } else if (cat === 'pen') {

    blocks.push(block('clear'));

  } else if (cat === 'control') {

    blocks.push(block('receiveGo'));
    blocks.push(block('receiveKey'));
    blocks.push(block('receiveClick'));
    blocks.push(block('receiveMessage'));
    blocks.push('-');
    blocks.push(block('doBroadcast'));
    blocks.push(block('doBroadcastAndWait'));
    blocks.push(watcherToggle('getLastMessage'));
    blocks.push(block('getLastMessage'));
    blocks.push('-');
    blocks.push(block('doWarp'));
    blocks.push('-');
    blocks.push(block('doWait'));
    blocks.push(block('doWaitUntil'));
    blocks.push('-');
    blocks.push(block('doForever'));
    blocks.push(block('doRepeat'));
    blocks.push(block('doUntil'));
    blocks.push('-');
    blocks.push(block('doIf'));
    blocks.push(block('doIfElse'));
    blocks.push('-');
    blocks.push(block('doReport'));
    blocks.push('-');
    /*
    // old STOP variants, migrated to a newer version, now redundant
        blocks.push(block('doStopBlock'));
        blocks.push(block('doStop'));
        blocks.push(block('doStopAll'));
    */
    blocks.push(block('doStopThis'));
    blocks.push(block('doStopOthers'));
    blocks.push('-');
    blocks.push(block('doRun'));
    blocks.push(block('fork'));
    blocks.push(block('evaluate'));
    blocks.push('-');
    /*
    // list variants commented out for now (redundant)
        blocks.push(block('doRunWithInputList'));
        blocks.push(block('forkWithInputList'));
        blocks.push(block('evaluateWithInputList'));
        blocks.push('-');
    */
    blocks.push(block('doCallCC'));
    blocks.push(block('reportCallCC'));
    blocks.push('-');
    blocks.push(block('createClone'));
    blocks.push('-');
    blocks.push(block('doPauseAll'));
    blocks.push('-');
    blocks.push(block('openWebsite'));

  } else if (cat === 'sensing') {

    blocks.push(block('doAsk'));
    blocks.push(watcherToggle('getLastAnswer'));
    blocks.push(block('getLastAnswer'));
    blocks.push('-');
    blocks.push(watcherToggle('reportMouseX'));
    blocks.push(block('reportMouseX'));
    blocks.push(watcherToggle('reportMouseY'));
    blocks.push(block('reportMouseY'));
    blocks.push(block('reportMouseDown'));
    blocks.push('-');
    blocks.push(block('reportKeyPressed'));
    blocks.push('-');
    blocks.push(block('doResetTimer'));
    blocks.push(watcherToggle('getTimer'));
    blocks.push(block('getTimer'));
    blocks.push('-');
    blocks.push(block('reportAttributeOf'));
    blocks.push('-');
    blocks.push(block('reportURL'));
    blocks.push('-');
    blocks.push(block('reportIsFastTracking'));
    blocks.push(block('doSetFastTracking'));
    blocks.push('-');
    blocks.push(block('reportDate'));

    // for debugging: ///////////////

    if (this.world().isDevMode) {

      blocks.push('-');
      txt = new TextMorph(localize(
        'development mode \ndebugging primitives:'
      ));
      txt.fontSize = 9;
      txt.setColor(this.paletteTextColor);
      blocks.push(txt);
      blocks.push('-');
      blocks.push(block('colorFiltered'));
      blocks.push(block('reportStackSize'));
      blocks.push(block('reportFrameCount'));
    }

    /////////////////////////////////

  } else if (cat === 'operators') {

    blocks.push(block('reifyScript'));
    blocks.push(block('reifyReporter'));
    blocks.push(block('reifyPredicate'));
    blocks.push('#');
    blocks.push('-');
    blocks.push(block('reportSum'));
    blocks.push(block('reportDifference'));
    blocks.push(block('reportProduct'));
    blocks.push(block('reportQuotient'));
    blocks.push('-');
    blocks.push(block('reportModulus'));
    blocks.push(block('reportRound'));
    blocks.push(block('reportMonadic'));
    blocks.push(block('reportRandom'));
    blocks.push('-');
    blocks.push(block('reportLessThan'));
    blocks.push(block('reportEquals'));
    blocks.push(block('reportGreaterThan'));
    blocks.push('-');
    blocks.push(block('reportAnd'));
    blocks.push(block('reportOr'));
    blocks.push(block('reportNot'));
    blocks.push('-');
    blocks.push(block('reportTrue'));
    blocks.push(block('reportFalse'));
    blocks.push('-');
    blocks.push(block('reportJoinWords'));
    blocks.push(block('reportTextSplit'));
    blocks.push(block('reportLetter'));
    blocks.push(block('reportStringSize'));
    blocks.push('-');
    blocks.push(block('reportUnicode'));
    blocks.push(block('reportUnicodeAsLetter'));
    blocks.push('-');
    blocks.push(block('reportIsA'));
    blocks.push(block('reportIsIdentical'));

    // for debugging: ///////////////

    if (this.world().isDevMode) {
      blocks.push('-');
      txt = new TextMorph(
        'development mode \ndebugging primitives:'
      );
      txt.fontSize = 9;
      txt.setColor(this.paletteTextColor);
      blocks.push(txt);
      blocks.push('-');
      blocks.push(block('reportTypeOf'));
      blocks.push(block('reportTextFunction'));
    }

    //////////////////////////////////

  } else if (cat === 'variables') {

    button = new PushButtonMorph(
      null,
      function() {
        new VariableDialogMorph(
          null,
          function(pair) {
            if (pair && !myself.variables.silentFind(pair[0])) {
              myself.addVariable(pair[0], pair[1]);
              myself.toggleVariableWatcher(pair[0], pair[1]);
              myself.blocksCache[cat] = null;
              myself.paletteCache[cat] = null;
              myself.parentThatIsA(IDE_Morph).refreshPalette();
            }
          },
          myself
        ).prompt(
          'Variable name',
          null,
          myself.world()
        );
      },
      'Make a variable'
    );
    blocks.push(button);

    if (this.variables.allNames().length > 0) {
      button = new PushButtonMorph(
        null,
        function() {
          var menu = new MenuMorph(
            myself.deleteVariable,
            null,
            myself
          );
          myself.variables.allNames().forEach(function(name) {
            menu.addItem(name, name);
          });
          menu.popUpAtHand(myself.world());
        },
        'Delete a variable'
      );
      blocks.push(button);
    }

    blocks.push('-');

    varNames = this.variables.allNames();
    if (varNames.length > 0) {
      varNames.forEach(function(name) {
        blocks.push(variableWatcherToggle(name));
        blocks.push(variableBlock(name));
      });
      blocks.push('-');
    }

    blocks.push(block('doSetVar'));
    blocks.push(block('doChangeVar'));
    blocks.push(block('doShowVar'));
    blocks.push(block('doHideVar'));
    blocks.push(block('doDeclareVariables'));

    blocks.push('=');

    blocks.push(block('reportNewList'));
    blocks.push('-');
    blocks.push(block('reportCONS'));
    blocks.push(block('reportListItem'));
    blocks.push(block('reportCDR'));
    blocks.push('-');
    blocks.push(block('reportListLength'));
    blocks.push(block('reportListContainsItem'));
    blocks.push('-');
    blocks.push(block('doAddToList'));
    blocks.push(block('doDeleteFromList'));
    blocks.push(block('doInsertInList'));
    blocks.push(block('doReplaceInList'));

    // for debugging: ///////////////

    if (this.world().isDevMode) {
      blocks.push('-');
      txt = new TextMorph(localize(
        'development mode \ndebugging primitives:'
      ));
      txt.fontSize = 9;
      txt.setColor(this.paletteTextColor);
      blocks.push(txt);
      blocks.push('-');
      blocks.push(block('reportMap'));
    }

    /////////////////////////////////

    blocks.push('=');

    if (StageMorph.prototype.enableCodeMapping) {
      blocks.push(block('doMapCodeOrHeader'));
      blocks.push(block('doMapStringCode'));
      blocks.push(block('doMapListCode'));
      blocks.push('-');
      blocks.push(block('reportMappedCode'));
      blocks.push('=');
    }

    button = new PushButtonMorph(
      null,
      function() {
        var ide = myself.parentThatIsA(IDE_Morph);
        new BlockDialogMorph(
          null,
          function(definition) {
            if (definition.spec !== '') {
              if (definition.isGlobal) {
                myself.globalBlocks.push(definition);
              } else {
                myself.customBlocks.push(definition);
              }
              ide.flushPaletteCache();
              ide.refreshPalette();
              new BlockEditorMorph(definition, myself).popUp();
            }
          },
          myself
        ).prompt(
          'Make a block',
          null,
          myself.world()
        );
      },
      'Make a block'
    );
    blocks.push(button);
  }
  return blocks;
};

StageMorph.prototype.turnCameraAroundXAxis = function(deg) {
  // This function does not work properly
  var vector = new THREE.Vector3(0, 0, -1);
  vector.applyQuaternion(this.camera.quaternion);

  var radius = Math.pow(Math.pow(this.camera.position.x, 2) +
    Math.pow(this.camera.position.y, 2) +
    Math.pow(this.camera.position.z, 2), 0.5);
  var theta = Math.atan2(-vector.x, -vector.y); // equator angle around y-up axis
  var phi = Math.acos(Math.max(-1, Math.min(1, -vector.z))); // polar angle

  if (this.camera.up.z > 0) phi += deg * Math.PI / 180;
  else phi -= deg * Math.PI / 180;
  if (phi * (phi + deg * Math.PI / 180) < 0) this.camera.up.z = -this.camera.up.z;

  var sinPhiRadius = Math.sin(phi) * radius;
  this.camera.position.x = sinPhiRadius * Math.sin(theta);
  this.camera.position.y = sinPhiRadius * Math.cos(theta);
  this.camera.position.z = Math.cos(phi) * radius;

  this.camera.lookAt({
    x: 0,
    y: 0,
    z: 0
  });
  this.changed();
};

StageMorph.prototype.turnCameraAroundYAxis = function(deg) {

  // This function does not work properly
  var vector = new THREE.Vector3(0, 0, -1);
  vector.applyQuaternion(this.camera.quaternion);


  var radius = Math.pow(Math.pow(this.camera.position.x, 2) +
    Math.pow(this.camera.position.y, 2) +
    Math.pow(this.camera.position.z, 2), 0.5);
  var theta = Math.atan2(-vector.x, -vector.y); // equator angle around y-up axis
  var phi = Math.acos(Math.max(-1, Math.min(1, -vector.z))); // polar angle

  theta += deg * Math.PI / 180;

  var sinPhiRadius = Math.sin(phi) * radius;
  this.camera.position.x = sinPhiRadius * Math.sin(theta);
  this.camera.position.y = sinPhiRadius * Math.cos(theta);
  this.camera.position.z = Math.cos(phi) * radius;

  this.camera.lookAt({
    x: 0,
    y: 0,
    z: 0
  });
  this.changed();
};

StageMorph.prototype.zoom = function(factor) {
  this.camera.position.x *= factor;
  this.camera.position.y *= factor;
  this.camera.position.z *= factor;

  this.camera.lookAt({
    x: 0,
    y: 0,
    z: 0
  });
  this.changed();
};

function round10(val, exp) {
  var pow = Math.pow(10, exp);
  return Math.round(val / pow) * pow;
}

var Dragging = false;
var DragX = 0,
  DragY = 0,
  stageHandle;

function _3DDragMouseDown(event) {
  stage = world.children[0].stage;
  if (event.button != 2 && inRect(event, stage.bounds)) {
    Dragging = true;
    DragX = event.x;
    DragY = event.y;
  }
}

function _3DDragMouseMove(event) {
  stage = world.children[0].stage;
  if (Dragging) {
    stage.turnCameraAroundYAxis((DragX - event.x) / -3.5)
    stage.turnCameraAroundXAxis((DragY - event.y) / 3.5)
    DragX = event.x;
    DragY = event.y;
  }
}

function _3DDragMouseUp(event) {
  Dragging = false;
}

function _3DMouseScroll(event) {
  stage = world.children[0].stage;
  if (inRect(event, stage.bounds)) {
    stage.zoom(1 + event.deltaY / 200);
  }
}

function inRect(point, rect) {
  return (point.x > rect.origin.x && point.x < rect.corner.x && point.y > rect.origin.y && point.y < rect.corner.y);
}
StageMorph.prototype.userMenu = function() {
  var ide = this.parentThatIsA(IDE_Morph),
    menu = new MenuMorph(this),
    shiftClicked = this.world().currentKey === 16,
    myself = this;

  if (ide && ide.isAppMode) {
    menu.addItem('help', 'nop');
    return menu;
  }
  menu.addItem("edit", 'edit');
  menu.addItem("show all", 'showAll');
  menu.addItem(
    "pic...",
    function() {
      world.children[0].saveFileAs(myself.fullImageClassic().toDataURL(), 'image/png', world.children[0].projetName + ' image');
    },
    'open a new window\nwith a picture of the stage'
  );
  menu.addItem("export 3D", 'exportSTLToServer');
  if (shiftClicked) {
    menu.addLine();
    menu.addItem(
      "turn pen trails into new costume...",
      function() {
        var costume = new Costume(
          myself.trailsCanvas,
          Date.now().toString()
        ).copy();
        ide.currentSprite.addCostume(costume);
        ide.currentSprite.wearCostume(costume);
        ide.hasChangedMedia = true;
      },
      'turn all pen trails and stamps\n' +
      'into a new costume for the\ncurrently selected sprite',
      new Color(100, 0, 0)
    );
  }
  return menu;
};
StageMorph.prototype.exportSTLToServer = function() {
  var exporter = new THREE.STLExporter();
  var obj = exporter.parse(this.scene);
  var blob = dataURItoBlob('text/plain,' + obj, 'text/plain');
  var data = new FormData();
  data.append('file', blob);
  $.ajax({
    type: 'PUT',
    url: config.urls.create_file_url,
    data: data,
    processData: false,
    contentType: false,
    success: function(data) {
      window.StageSTLURL = data.url;
      saveAs(blob, 'anishinaabe_arc.stl');
      // window.open(window.StageSTLURL);
    }
  }).fail(function() {
    alert("failed");
  });
};

StageMorph.prototype.toXML = function (serializer) {
    var thumbnail = this.thumbnail(SnapSerializer.prototype.thumbnailSize),
        thumbdata,
        ide = this.parentThatIsA(IDE_Morph);

    // catch cross-origin tainting exception when using SVG costumes
    try {
        thumbdata = thumbnail.toDataURL('image/png');
    } catch (error) {
        thumbdata = null;
    }

    function code(key) {
        var str = '';
        Object.keys(StageMorph.prototype[key]).forEach(
            function (selector) {
                str += (
                    '<' + selector + '>' +
                        XML_Element.prototype.escape(
                            StageMorph.prototype[key][selector]
                        ) +
                        '</' + selector + '>'
                );
            }
        );
        return str;
    }

    this.removeAllClones();
    return serializer.format(
        '<project name="@" app="@" version="@">' +
            '<notes>$</notes>' +
            '<thumbnail>$</thumbnail>' +
            '<stage name="@" width="@" height="@" ' +
            'costume="@" tempo="@" threadsafe="@" ' +
            'lines="@" ' +
            'codify="@" ' +
            'scheduled="@" ~>' +
            '<pentrails>$</pentrails>' +
            '<STL href="@"/>' +
            '<costumes>%</costumes>' +
            '<sounds>%</sounds>' +
            '<variables>%</variables>' +
            '<blocks>%</blocks>' +
            '<scripts>%</scripts><sprites>%</sprites>' +
            '</stage>' +
            '<hidden>$</hidden>' +
            '<headers>%</headers>' +
            '<code>%</code>' +
            '<blocks>%</blocks>' +
            '<variables>%</variables>' +
            '</project>',
        (ide && ide.projectName) ? ide.projectName : 'Untitled',
        serializer.app,
        serializer.version,
        (ide && ide.projectNotes) ? ide.projectNotes : '',
        thumbdata,
        this.name,
        StageMorph.prototype.dimensions.x,
        StageMorph.prototype.dimensions.y,
        this.getCostumeIdx(),
        this.getTempo(),
        this.isThreadSafe,
        SpriteMorph.prototype.useFlatLineEnds ? 'flat' : 'round',
        this.enableCodeMapping,
        StageMorph.prototype.frameRate !== 0,
        this.trailsCanvas.toDataURL('image/png'),
        window.StageSTLURL,
        serializer.store(this.costumes, this.name + '_cst'),
        serializer.store(this.sounds, this.name + '_snd'),
        serializer.store(this.variables),
        serializer.store(this.customBlocks),
        serializer.store(this.scripts),
        serializer.store(this.children),
        Object.keys(StageMorph.prototype.hiddenPrimitives).reduce(
                function (a, b) {return a + ' ' + b; },
                ''
            ),
        code('codeHeaders'),
        code('codeMappings'),
        serializer.store(this.globalBlocks),
        (ide && ide.globalVariables) ?
                    serializer.store(ide.globalVariables) : ''
    );
};



/**
 * @author mrdoob / http://mrdoob.com/
 */

 /**
  * Based on https://github.com/mrdoob/three.js/blob/a72347515fa34e892f7a9bfa66a34fdc0df55954/examples/js/exporters/STLExporter.js
  * Tested on r68 and r70
  * @author kjlubick / https://github.com/kjlubick
  * @author kovacsv / http://kovacsv.hu/
  * @author mrdoob / http://mrdoob.com/
  */
 THREE.STLExporter = function () {};

 THREE.STLExporter.prototype = {

 	constructor: THREE.STLExporter,

 	parse: ( function () {

 		var vector = new THREE.Vector3();
 		var normalMatrixWorld = new THREE.Matrix3();

 		return function ( scene ) {

 			var output = '';

 			output += 'solid exported\n';

 			scene.traverse( function ( object ) {

 				if ( object instanceof THREE.Mesh ) {

 					var geometry = object.geometry;
 					var matrixWorld = object.matrixWorld;
 					var mesh = object;

 					if ( geometry instanceof THREE.Geometry ) {

 						var vertices = geometry.vertices;
 						var faces = geometry.faces;

 						normalMatrixWorld.getNormalMatrix( matrixWorld );

 						for ( var i = 0, l = faces.length; i < l; i ++ ) {
 							var face = faces[ i ];

 							vector.copy( face.normal ).applyMatrix3( normalMatrixWorld ).normalize();

 							output += '\tfacet normal ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';
 							output += '\t\touter loop\n';

 							var indices = [ face.a, face.b, face.c ];

 							for ( var j = 0; j < 3; j ++ ) {
 								var vertexIndex = indices[ j ];
 								if (mesh.geometry.skinIndices.length == 0) {
 									vector.copy( vertices[ vertexIndex ] ).applyMatrix4( matrixWorld );
 									output += '\t\t\tvertex ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';
 								} else {
 									vector.copy( vertices[ vertexIndex ] ); //.applyMatrix4( matrixWorld );

 									// see https://github.com/mrdoob/three.js/issues/3187
 									boneIndices = [];
 									boneIndices[0] = mesh.geometry.skinIndices[vertexIndex].x;
 									boneIndices[1] = mesh.geometry.skinIndices[vertexIndex].y;
 									boneIndices[2] = mesh.geometry.skinIndices[vertexIndex].z;
 									boneIndices[3] = mesh.geometry.skinIndices[vertexIndex].w;

 									weights = [];
 									weights[0] = mesh.geometry.skinWeights[vertexIndex].x;
 									weights[1] = mesh.geometry.skinWeights[vertexIndex].y;
 									weights[2] = mesh.geometry.skinWeights[vertexIndex].z;
 									weights[3] = mesh.geometry.skinWeights[vertexIndex].w;

 									inverses = [];
 									inverses[0] = mesh.skeleton.boneInverses[ boneIndices[0] ];
 									inverses[1] = mesh.skeleton.boneInverses[ boneIndices[1] ];
 									inverses[2] = mesh.skeleton.boneInverses[ boneIndices[2] ];
 									inverses[3] = mesh.skeleton.boneInverses[ boneIndices[3] ];

 									skinMatrices = [];
 									skinMatrices[0] = mesh.skeleton.bones[ boneIndices[0] ].matrixWorld;
 									skinMatrices[1] = mesh.skeleton.bones[ boneIndices[1] ].matrixWorld;
 									skinMatrices[2] = mesh.skeleton.bones[ boneIndices[2] ].matrixWorld;
 									skinMatrices[3] = mesh.skeleton.bones[ boneIndices[3] ].matrixWorld;

 									var finalVector = new THREE.Vector4();
 									for(var k = 0; k<4; k++) {
 										var tempVector = new THREE.Vector4(vector.x, vector.y, vector.z);
 										tempVector.multiplyScalar(weights[k]);
 										//the inverse takes the vector into local bone space
 										tempVector.applyMatrix4(inverses[k])
 										//which is then transformed to the appropriate world space
 										.applyMatrix4(skinMatrices[k]);
 										finalVector.add(tempVector);
 									}
 									output += '\t\t\tvertex ' + finalVector.x + ' ' + finalVector.y + ' ' + finalVector.z + '\n';
 								}
 							}
 							output += '\t\tendloop\n';
 							output += '\tendfacet\n';
 						}
 					}
 				}

 			} );

 			output += 'endsolid exported\n';

 			return output;
 		};
 	}() )
 };

 // Use FileSaver.js 'saveAs' function to save the string
 function saveSTL( scene, name ){
   var exporter = new THREE.STLExporter();
   var stlString = exporter.parse( scene );

   var blob = new Blob([stlString], {type: 'text/plain'});

   saveAs(blob, name + '.stl');
 }
function dataURItoBlob(dataURI, type) {
    var binary;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        binary = atob(dataURI.split(',')[1]);
    else
        binary = unescape(dataURI.split(',')[1]);
    //var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: type});
}
window.addEventListener("mousedown", _3DDragMouseDown);
window.addEventListener("mousemove", _3DDragMouseMove);
window.addEventListener("mouseup", _3DDragMouseUp);
window.addEventListener("wheel", _3DMouseScroll);

IDE_Morph.prototype.updateCorralBar = function() {}

//# sourceURL=code.js
