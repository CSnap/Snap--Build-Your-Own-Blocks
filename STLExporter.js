/**
 * @author kovacsv / http://kovacsv.hu/
 * @author mrdoob / http://mrdoob.com/
 * @author mudcube / http://mudcu.be/
 * @author Mugen87 / https://github.com/Mugen87
 *
 * Usage:
 *  var exporter = new THREE.STLExporter();
 *
 *  // second argument is a list of options
 *  var data = exporter.parse( mesh, { binary: true } );
 *
 */

//this code is last done by Jimmy Ruan
//reach me @	773-280-1417
//				jiruan@umich.edu (may or may not be reachable after I graduated)

// Jimmy's note: the original code seems like it's pulled from Three.js's example code
// at https://github.com/mrdoob/three.js/blob/master/examples/js/exporters/STLExporter.js

THREE.STLExporter = function () {};

THREE.STLExporter.prototype = {

	constructor: THREE.STLExporter,

	parse: ( function () {
/*
		var vector = new THREE.Vector3();
		var normalMatrixWorld = new THREE.Matrix3();
*/
		return function parse( image, directory, filename, options ) {
			//simply sends the image to the backend to let it process the STL file
			//then send a request for the STL file, subsequently saving the resulting received file
			//parameter:
			//	image [required](data URI): the url of the image (converted using toDataURL or the like)
			//	directory [required](str): the directory the STL file should be saved to
			//  filename (str): the filename to name the STL file as
			//		*NOTE: TODO: filename may not be needed as it can be sent via the resulting request
			//	options: various options specifying parameters to create the STL file with
			//		TODO: do something with options

				//<jimmy's code>
			//simply prints the string into console
			//copy the URL into the address bar itself during debugging
			//the url should display the image of the stage by entering it into the address bar
			console.log("IMAGE URL:\n" + image);
			console.log("\n\nSending image url into " + directory);

			//send post request to backend with data url
			//should receive the STL model as a response
			fetch(directory,
				{
					method: "POST",
					body: image //note to future self: this is the form data
					//change the form data however you like to fit backend
					//try not to do the other way around
					//mode: whatever value gets rid of cors error
					//may or may not need to change mode to avoid cross site origin security error

					//add other stuff here
					//reference: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
				}
			)
				.then(function() { //now we get the resulting STL file
					fetch(directory)
						.then(function(response) {
							return response.blob();
						})
						.then(function(STLBlob) {
							saveAs(STLBlob, filename); //this should download the file
						});
				})
				.catch(function(errorMessage) {
					console.log("Failed to send image to " + directory);
					console.log("Error: " + errorMessage);
				});
                //</jimmy's code>

/*
			//<code from three.STLEXPORTER>

			var binary = options.binary !== undefined ? options.binary : false;

			var objects = [];
			var triangles = 0;

			scene.traverse( function ( object ) {

				if ( object.isMesh ) {

					var geometry = object.geometry;

					if ( geometry.isBufferGeometry ) {

						geometry = new THREE.Geometry().fromBufferGeometry( geometry );

					}

					if ( geometry.isGeometry ) {

						triangles += geometry.faces.length;

						objects.push( {

							geometry: geometry,
							matrixWorld: object.matrixWorld

						} );

					}

				}

			} );

			if ( binary ) {

				var offset = 80; // skip header
				var bufferLength = triangles * 2 + triangles * 3 * 4 * 4 + 80 + 4;
				var arrayBuffer = new ArrayBuffer( bufferLength );
				var output = new DataView( arrayBuffer );
				output.setUint32( offset, triangles, true ); offset += 4;

				for ( var i = 0, il = objects.length; i < il; i ++ ) {

					var object = objects[ i ];

					var vertices = object.geometry.vertices;
					var faces = object.geometry.faces;
					var matrixWorld = object.matrixWorld;

					normalMatrixWorld.getNormalMatrix( matrixWorld );

					for ( var j = 0, jl = faces.length; j < jl; j ++ ) {

						var face = faces[ j ];

						vector.copy( face.normal ).applyMatrix3( normalMatrixWorld ).normalize();

						output.setFloat32( offset, vector.x, true ); offset += 4; // normal
						output.setFloat32( offset, vector.y, true ); offset += 4;
						output.setFloat32( offset, vector.z, true ); offset += 4;

						var indices = [ face.a, face.b, face.c ];

						for ( var k = 0; k < 3; k ++ ) {

							vector.copy( vertices[ indices[ k ] ] ).applyMatrix4( matrixWorld );

							output.setFloat32( offset, vector.x, true ); offset += 4; // vertices
							output.setFloat32( offset, vector.y, true ); offset += 4;
							output.setFloat32( offset, vector.z, true ); offset += 4;

						}

						output.setUint16( offset, 0, true ); offset += 2; // attribute byte count

					}

				}

				return output;

			} else {

				var output = '';

				output += 'solid exported\n';

				for ( var i = 0, il = objects.length; i < il; i ++ ) {

					var object = objects[ i ];

					var vertices = object.geometry.vertices;
					var faces = object.geometry.faces;
					var matrixWorld = object.matrixWorld;

					normalMatrixWorld.getNormalMatrix( matrixWorld );

					for ( var j = 0, jl = faces.length; j < jl; j ++ ) {

						var face = faces[ j ];

						vector.copy( face.normal ).applyMatrix3( normalMatrixWorld ).normalize();

						output += '\tfacet normal ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';
						output += '\t\touter loop\n';

						var indices = [ face.a, face.b, face.c ];

						for ( var k = 0; k < 3; k ++ ) {

							vector.copy( vertices[ indices[ k ] ] ).applyMatrix4( matrixWorld );

							output += '\t\t\tvertex ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';

						}

						output += '\t\tendloop\n';
						output += '\tendfacet\n';

					}

				}

				output += 'endsolid exported\n';

				return output;

			}
			//</code from three.STLEXPORTER>

*/
		};

	}() )

};
