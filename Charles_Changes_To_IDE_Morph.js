IDE_Morph.prototype.droppedBinary = function (anArrayBuffer, name, aFile) {
    // dynamically load ypr->Snap!
    console.log("DROPPED BINARY FUNCTION");
    console.log(anArrayBuffer);
    var ypr = document.getElementById('ypr'),
        myself = this,
        suffix = name.substring(name.length - 3);
    console.log(ypr);
    console.log(suffix);
    if (suffix.toLowerCase() === 'ypr') {
        console.log(suffix);

        function loadYPR(buffer, lbl) {
            var reader = new sb.Reader(),
                pname = lbl.split('.')[0]; // up to period
            reader.onload = function (info) {
                myself.droppedText(new sb.XMLWriter().write(pname, info));
            };
            reader.readYPR(new Uint8Array(buffer));
        }

        if (!ypr) {
            console.log("MAKING AN YPR ELEMENT?");
            ypr = document.createElement('script');
            ypr.id = 'ypr';
            ypr.onload = function () {loadYPR(anArrayBuffer, name); };
            document.head.appendChild(ypr);
            ypr.src = 'ypr.js';
        } else {
            console.log("LOADING YPR");
            loadYPR(anArrayBuffer, name);
        }
    } else if (suffix.toLowerCase() === 'zip' ||
        suffix.toLowerCase() === 'smod') {
        console.log("WAS A ZIP");
		var mdl = new ModuleLoader(this);
		var zip = new JSZip(anArrayBuffer);
        mdl.open(zip, {base64: false});
    }
    // here is the case to import rw files
   else if (suffix.toLowerCase() == '.rw'){
    console.log("IS AN RW");
    console.log(aFile);
    myself.droppedRWFile(aFile);
   }
    
};