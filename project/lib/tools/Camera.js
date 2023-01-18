import {makeButton,degToRad} from '../utils.js';

let drag;

let THETA = degToRad(270),	//ANGLE X
	PHI = degToRad(25);		//ANGLE Y
let old_x, old_y;
let dX, dY;
let lookAt = false;
//
let animateCamera = false;
let maxRadius = 360,
	minRadius = 30;

export class Camera {

	constructor(position,lookAt, up) {
		this.position = position;
		this.forward = m4.normalize(m4.subtractVectors(lookAt, position));
        this.right = m4.normalize(m4.cross(this.forward, up));
        this.up = m4.normalize(m4.cross(this.right, this.forward));
		this.fieldOfView = 70;
	}	

 
    tilt(step){
        let rotation = m4.axisRotation(this.right, (step / 2));
        this.forward = m4.transformPoint(rotation, this.forward)
        this.up = m4.transformPoint(rotation, this.up)

        this.forward = m4.normalize(this.forward);
        this.up = m4.normalize(this.up)
		this.right = m4.normalize(m4.cross(this.forward, this.up));
		 
    }

	align(){
		let lookAt = [0,1,0];
		m4.normalize(m4.subtractVectors(lookAt, this.position));

        let up=[0,1,0];
		this.right = m4.normalize(m4.cross(this.forward, up));
        this.up = m4.normalize(m4.cross(this.right, this.forward));
	}

    pan(step){
        let rotation = m4.axisRotation(this.up, step);
        this.forward = m4.transformPoint(rotation,this.forward);
        this.right = m4.transformPoint(rotation,this.right);

        this.forward = m4.normalize(this.forward);
        this.right = m4.normalize(this.right);
    }

    cant(step){
        let rotation = m4.axisRotation(this.forward, (step / 2));
        this.right = m4.transformPoint(rotation, this.right)
        this.up = m4.transformPoint(rotation, this.up)

        this.right = m4.normalize(this.right);
        this.up = m4.normalize(this.up);
    }

    truck(dist){
        this.position[0] += + (this.right[0] * dist);
        this.position[1] += + (this.right[1] * dist);
        this.position[2] += + (this.right[2] * dist);
    }

     pedestal(dist){
        this.position[0] += (this.up[0] * dist);
        this.position[1] += (this.up[1] * dist);
        this.position[2] += (this.up[2] * dist);
    }

    dolly(dist){
        this.position[0] += (this.forward[0] * dist);
        this.position[1] += (this.forward[1] * dist);
        this.position[2] += (this.forward[2] * dist);
    }


	getRadius () {
		return this.radius;
	}
	
	setPos(x,y,z){
		this.position[0] = x;
		this.position[1] = y;
		this.position[2] = z;
	}

	// Make a view matrix from the camera matrix.
	viewMatrix() {
		const look = m4.addVectors(this.position, this.forward);
		let cameraMatrix;
		if(lookAt || animateCamera){
        	cameraMatrix = m4.lookAt(this.position, this.target, this.up);
		}	else
			cameraMatrix = m4.lookAt(this.position, look, this.up);
        return m4.inverse(cameraMatrix); // ViewMatrix
	}

	// Compute the projection matrix
	projectionMatrix(gl) {
		let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		return m4.perspective(this.fieldOfView, aspect, 0.1, 200);
	}
	setLookAt(coords){
		console.log(coords)
		lookAt = true;
		this.target =[  coords.y, coords.z, coords.x ];
	}
	disableLookAt(){
		lookAt = false;
	}
	getPosition(){
		return this.position;
	}
}

export function setCameraControls(canvas,camera,look) {
	lookAt = look;
	window.addEventListener("keydown", function (e){
		let step = 0.2;
		switch (e.key){
			case "w" :{
				camera.dolly(step);
				break;
			}
			case "s" : {
				camera.dolly(-step);
				break;
			}
			case "a": {
				camera.truck(-step);
				break;
			}
			case "d": {
				camera.truck(step);
				break;
			}
			case "q": {
				camera.pedestal(step);
				break;
			}
			case "e": {
					camera.pedestal(-step);
					break;
				}
			case "g": {
				camera.cant(-step);
				break;
			}
			case "k": {
				camera.cant(step);
				break;
			}
			case "u":  {
				camera.pedestal(step);
				break;
			}
			case "j": {
				camera.pedestal(-step);
				break;
			}
			case "ArrowUp": {
				camera.tilt(step);
				break;
			}
			case "ArrowDown": {
				camera.tilt(-step);
				break;
			}
			case "ArrowLeft": {
				camera.pan(step );
				break;
			}
			case "ArrowRight": {
				camera.pan(-step);
				break;
			}
			case "l": {
				camera.align();
				break;
			}
		}});

	canvas.onmousedown = function (e) {
		drag = true;
		old_x = e.pageX;
		old_y = e.pageY;
		e.preventDefault();
		return false;
	};

	canvas.onmouseup = function (e) {
		drag = false;
	};

	canvas.onmousemove = function (e) {
		if (!drag) return false;
		dX = (-(e.pageX - old_x) * 2 * Math.PI) / canvas.width;
		dY = (-(e.pageY - old_y) * 2 * Math.PI) / canvas.height;
		camera.pan(dX * 0.2);
		camera.tilt	(dY * 0.2);
		old_x = e.pageX;
		old_y = e.pageY;
		e.preventDefault();
	};

	canvas.ontouchstart = function (touch) {
		drag = true;
		old_x = touch.changedTouches[0].pageX;
		old_y = touch.changedTouches[0].pageY;
		touch.preventDefault();
		return false;
	};

	canvas.ontouchmove = function (touch) {
		if (!drag) return false;
		let touches = touch.changedTouches;
		for(let i = 0 ; i < touches.length ; i++) {
			dX = (-(touches[i].pageX - old_x) * 2 * Math.PI) / canvas.width;
			dY = (-(touches[i].pageY - old_y) * 2 * Math.PI) / canvas.height;
			camera.pan(dX * 0.2);
			camera.tilt	(dY * 0.2);
			old_x = touches[i].pageX;
			old_y = touches[i].pageY;
			touch.preventDefault();	
		  }
		
		return false;
	};
	
	canvas.ontouchend = function (touch) {
		drag = false;
	};

	canvas.onmousewheel = function (e) {
		var delta = 0;
		if (!e) e = window.event;
		if (e.wheelDelta) {
			delta = e.wheelDelta / 120;
		} else if (e.detail) {
			delta = -e.detail / 3;
		}
		if (delta) {
			camera.dolly(delta * 0.3);
		}
		if (e.preventDefault) e.preventDefault();
		e.returnValue = false;
};


}

//Canvas 2D 
//draw buttons
export function makeKeyCanvas(context,canvas,camera) {
	context.clearRect(0, 0, context.clientWidth, context.clientHeight);

    var buttons = [];
    buttons.push(makeButton(1, 40,100, 30, 30, 'S', '#0ea5e9', 'white', 'white', function () {camera.dolly(-step); }))
    buttons.push(makeButton(2, 40, 20, 30, 30, 'W', '#0ea5e9', 'white', 'white', function () { camera.dolly(step); }))
    buttons.push(makeButton(3, 75, 60, 30, 30, 'D', '#0ea5e9', 'white', 'white', function () {  camera.truck(step); }))
    buttons.push(makeButton(4, 5, 60, 30, 30, 'A', '#0ea5e9', 'white', 'white', function () { camera.truck(-step); }))
    

    drawAll();
     canvas.addEventListener("click", function (e) {
		let step = 0.3;

        if (context.isPointInPath(buttons[0], e.offsetX, e.offsetY)) {
             camera.dolly(-step);
        }
        if (context.isPointInPath(buttons[1], e.offsetX, e.offsetY)) {
             camera.dolly(step);
        }
        if (context.isPointInPath(buttons[2], e.offsetX, e.offsetY)) {
             camera.truck(step);
        }
        if (context.isPointInPath(buttons[3], e.offsetX, e.offsetY)) {
             camera.truck(-step);
        }

    });

    function drawAll() {
        for (var i = 0; i < buttons.length; i++) {
            drawButton(buttons[i], false);
        }
    }

    function drawButton(b, isDown) {
        context.clearRect(b.x - 1, b.y - 1, b.w + 2, b.h + 2);
        context.fillStyle = b.fill;
        context.fillRect(b.x, b.y, b.w, b.h);
        context.strokeStyle = b.stroke;
        context.strokeRect(b.x, b.y, b.w, b.h);
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = b.labelcolor;
        context.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2);
        if (isDown) {
            context.beginPath();
            context.moveTo(b.x, b.y + b.h);
            context.lineTo(b.x, b.y);
            context.lineTo(b.x + b.w, b.y);
            context.strokeStyle = 'black';
            context.stroke();
        }
    }
}