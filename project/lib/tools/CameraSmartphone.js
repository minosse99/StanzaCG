import { degToRad,radToDeg } from "../utils.js";
let updateCamera = true;

let drag;
let THETA = degToRad(90),
	PHI = degToRad(50);
let old_x, old_y;
let dX, dY;

//
let radius = 50;
let maxRadius = 360,
	minRadius = 30;

export class CameraSmartphone {

	constructor(position, up, target, fieldOfView) {
		this.position = position;
		this.up = up;
		this.target = target;
		this.fieldOfView = fieldOfView;
	}	

	radiusModify(radius) {
		return radius * Math.cos(PHI);
	}

	moveCamera() {
		this.position[0] = Math.cos(THETA) * this.radiusModify(radius);
		this.position[2] = Math.sin(THETA) * this.radiusModify(radius);
		this.position[1] = Math.sin(PHI) * radius;
		updateCamera = false;
	}

	// Compute the camera's matrix using look at.
	cameraMatrix() {
		return m4.lookAt(this.position, this.target, this.up);
	}

	// Make a view matrix from the camera matrix.
	viewMatrix() {
		return m4.inverse(this.cameraMatrix());
	}

	// Compute the projection matrix
	projectionMatrix(gl) {
		let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		return m4.perspective(this.fieldOfView, aspect, 1, 2000);
	}
}

export function getUpdateCamera (camera){
	if(updateCamera) {
		camera.moveCamera();
	}
}

export function setCameraControlSmartphone(canvas) {

	canvas.ontouchstart = function (touch) {
		drag = true;
		old_x = touch.changedTouches[0].pageX;
		old_y = touch.changedTouches[0].pageY;
		touch.preventDefault();
		return false;
	};

	canvas.ontouchmove = function (touch) {
		if (!drag) return false;
		updateCamera = true;
		let touches = touch.changedTouches;


		for(let i = 0 ; i < touches.length ; i++) {
			dX = (-(touches[i].pageX - old_x) * 2 * Math.PI) / canvas.width;
			dY = (-(touches[i].pageY - old_y) * 2 * Math.PI) / canvas.height;
			THETA += dX;
			PHI -= dY;
			if (PHI > degToRad(85)) PHI = degToRad(85);
			if (PHI < degToRad(0)) PHI = degToRad(0);
			
			old_x = touches[i].pageX;
			old_y = touches[i].pageY;
			touch.preventDefault();	
		  }

		return false;
	};

	canvas.ontouchend = function (touch) {
		drag = false;
	};

}