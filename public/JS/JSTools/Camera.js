let updateCamera = true;
// Parametri globali utilizzati all'interno di Camera.js.
//
let drag;
let THETA = degToRad(270), //ANGLE X
	PHI = degToRad(25);		//ANGLE Y
let old_x, old_y;
let dX, dY;
let lookAt = false;
//
let animateCamera = false;
let maxRadius = 360,
	minRadius = 30;

// Definizione della classe "Camera".
// A suo interno vi è la completa gestione delle caratteristiche relative
// alla camera.
export class Camera {
	// Costruttore della classe "Camera".
	// position, posizione spaziale (x, y, z) della camera.
	// up, ...
	// target, soggetto della scena.
	// fieldOfView, ...


	constructor(position, up, target, fieldOfView) {
		this.position = position;
		this.up = up;
		this.target = target;
		this.fieldOfView = fieldOfView;
		this.radius = 30;
		
		this.forward = m4.normalize(m4.subtractVectors(target,position));
		//this.forward[1]= 0;
        this.right = m4.normalize(m4.cross(this.forward,up));
       // this.up = m4.normalize(m4.cross(this.right, this.forward));
	}	

	radiusModify(radius) {
		return radius * Math.cos(PHI);
	}

	moveCamera() {
		if (animateCamera) this.animateCamera();
		//console.log("Camera update");
		this.position[0] = Math.cos(THETA) * this.radiusModify(this.radius);
		this.position[1] = Math.sin(THETA) * this.radiusModify(this.radius);
		this.position[2] = Math.sin(PHI) * this.radius;
		updateCamera = false;
	}

	 // Ruota la visuale di una telecamera in alto o in basso.
    // Puoi inclinare verso l'alto o verso il basso.
    tilt(step){
        let rotation = m4.axisRotation(this.right, (step / 2));
        this.forward = m4.transformPoint(rotation, this.forward)
        this.up = m4.transformPoint(rotation, this.up)

        this.forward = m4.normalize(this.forward);
        this.up = m4.normalize(this.up)
    }

	align(){
        this.up=[0,0,1];
        this.forward[0] = 0;
        this.right = m4.normalize(m4.cross(this.forward, this.up));
    }

    // Ruota la visuale della telecamera orizzontalmente rispetto alla posizione dell'occhio della telecamera
    // È possibile eseguire una panoramica a sinistra o una panoramica a destra.
    pan(step){
        let rotation = m4.axisRotation(this.up, step);
        this.forward = m4.transformPoint(rotation,this.forward);
        this.right = m4.transformPoint(rotation,this.right);

        this.forward = m4.normalize(this.forward);
        this.right = m4.normalize(this.right);
    }

    // Inclina una telecamera lateralmente mantenendone la posizione e la direzione di visualizzazione.
    cant(step){
        let rotation = m4.axisRotation(this.forward, (step / 2));
        this.right = m4.transformPoint(rotation, this.right)
        this.up = m4.transformPoint(rotation, this.up)

        this.right = m4.normalize(this.right);
        this.up = m4.normalize(this.up);
    }

    // Sposta la posizione di una telecamera lateralmente (sinistra o destra) mentre la direzione della visuale della telecamera è invariata.
    // Puoi spostarti verso sinistra o verso destra.
    truck(dist){
        this.position[0] += + (this.right[0] * dist);
        this.position[1] += + (this.right[1] * dist);
        this.position[2] += + (this.right[2] * dist);
    }

    // Alza o abbassa una telecamera sul suo supporto.
    // Puoi alzare il piedistallo e abbassare il piedistallo.
    pedestal(dist){
        this.position[0] += (this.up[0] * dist);
        this.position[1] += (this.up[1] * dist);
        this.position[2] += (this.up[2] * dist);
    }

    // Sposta una telecamera più vicino o più lontano dalla posizione che sta guardando.
    // Puoi entrare e uscire.
    dolly(dist){
        this.position[0] += (this.forward[0] * dist);
        this.position[1] += (this.forward[1] * dist);
        this.position[2] += (this.forward[2] * dist);
    }


	getRadius () {
		return this.radius;
	}
	
	smoothReset() {
		if (THETA > degToRad(180)) THETA += 0.01;  
		if (THETA < degToRad(180)) THETA -= 0.01;
		if (PHI > degToRad(45)) PHI -= 0.01; 
		if (PHI < degToRad(45)) PHI += 0.01; 
	}

	
	animateCamera() {
		updateCamera = true;
		this.smoothReset();
		//if (THETA > degToRad(179) && THETA < degToRad(181)) THETA = degToRad(180);
		//if (PHI > degToRad(44) && PHI < degToRad(46)) PHI = degToRad(45);
		
	}
	setTheta(dim) {
		THETA = degToRad(dim) ;	
		updateCamera = true;
	}

	setPhi(dim){
		PHI = degToRad(dim);
		updateCamera = true;
	}
	
	setRadius(dim) {
		this.radius = this.radiusModify(dim);
		updateCamera = true;
	}


	// Make a view matrix from the camera matrix.
	viewMatrix() {
		const look = m4.addVectors(this.position, this.forward);
		let cameraMatrix;
		if(lookAt || animateCamera)
        	cameraMatrix = m4.lookAt(this.position, this.target, this.up);
		else
			cameraMatrix = m4.lookAt(this.position, look, this.up);
        return m4.inverse(cameraMatrix); // ViewMatrix
	}

	// Compute the projection matrix
	projectionMatrix(gl) {
		let aspect = gl.canvas.width / gl.canvas.height;
		return m4.perspective(this.fieldOfView, aspect, 1, 2000);
	}
	setLookAt(coords){
		console.log(coords)
		lookAt = true;
		this.target =[ coords.x , coords.y , coords.z];
	}
	disableLookAt(){
		lookAt = false;
	}
	
}

export function getanimateCamera() {
	return animateCamera;
}

export function getUpdateCamera() {
	return updateCamera;
}

export function setCameraControls(canvas,camera,l) {
	
	lookAt = l;
	window.addEventListener("keydown", function (e){
		let step = 0.1;
		switch (e.key){
			case "r":{
			if(animateCamera === false){
				//camera.getOriginalPosition();
				animateCamera = true;
			}else 
				animateCamera = false;
			break;}
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
		updateCamera = true;
		dX = (-(e.pageX - old_x) * 2 * Math.PI) / canvas.width;
		dY = (-(e.pageY - old_y) * 2 * Math.PI) / canvas.height;
		THETA += dX;
		PHI -= dY;
		if (PHI > degToRad(85)) PHI = degToRad(85);
		if (PHI < degToRad(0)) PHI = degToRad(0);
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

function degToRad(d) {
	return (d * Math.PI) / 180;
}

function radTodeg(d){
	return (d * 180) / Math.PI;
}