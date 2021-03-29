(function () {
    return function (distance, direction) {
		
		var vector;

        // set the initial direction
        if(direction[0] === 'height') {
          vector = new THREE.Vector3( 0, 0, 1 );
        } else if(direction[0] === 'width'){
          vector = new THREE.Vector3( 0, 1, 0 );
        }else {
          vector = new THREE.Vector3( 1, 0, 0 );
        }

    	vector.applyQuaternion( this.object.quaternion );
    	vector.multiplyScalar(distance);

        this.gotoXYZ(vector.x + this.object.position.x,vector.y +this.object.position.y,vector.z+this.object.position.z);
        this.positionTalkBubble();
    };
}());


 //# sourceURL=TranslateBy.js