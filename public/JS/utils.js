"use strict"
	function degToRad(d) {
		return d * Math.PI / 180;
	}

	function radToDeg(r) {
		return r * 180 / Math.PI;
	}

	function  projectionMatrix(gl){
		let fieldOfViewRadians = degToRad(70);
		let aspect =gl.canvas.clientWidth / gl.canvas.clientHeight;
		let zmin=0.1;
		return m4.perspective(fieldOfViewRadians, aspect, zmin, 200);
	}
	
	function createXYQuadVertices() {
		let xOffset = 0;
		let yOffset = 0;
		let size = 1;
		return {
			position: {
				numComponents: 2,
				data: [
					xOffset + -1 * size, yOffset + -1 * size,
					xOffset +  1 * size, yOffset + -1 * size,
					xOffset + -1 * size, yOffset +  1 * size,
					xOffset +  1 * size, yOffset +  1 * size,
				],
			},
			normal: [
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
			],
			texcoord: [
				0, 0,
				1, 0,
				0, 1,
				1, 1,
			],
			indices: [ 0, 1, 2, 2, 1, 3 ],
		};
	}

	function isSmartphone(canvas) {
		return (canvas.clientHeight < 400 || canvas.clientWidth < 400);
	}
	
	export {degToRad,radToDeg,createXYQuadVertices,projectionMatrix,isSmartphone};