import {Camera} from "./camera.js";
import {degToRad} from "../utils.js";

export class AnimatedCamera extends Camera{
    constructor() {
        const position = [-47,7,3], target = [0, 1, 0], up = [0, 1, 0];
        // lookAt and up are not used in this camera.
        super(position,target, up,70);
        this.THETA = degToRad(90); // Angle of the camera in the XY plane
        this.PHI = degToRad(40); // Angle of the camera in the XZ plane
        // Radius of the circumference
        this.radius = 30
        console.log(this)
    }

    radiusModify(radius) {
		return radius * Math.cos(this.PHI);
	}

    move(){
        if (this.THETA > degToRad(180)) this.THETA += 0.001;  
		if (this.THETA < degToRad(180)) this.THETA -= 0.001;
		if (this.PHI > degToRad(45)) this.PHI -= 0.001; 
		if (this.PHI < degToRad(45)) this.PHI += 0.001; 

        this.position[0] = Math.sin(this.THETA) * this.radiusModify(this.radius);
		this.position[1] = Math.sin(this.PHI) * this.radius;
        this.position[2] = Math.cos(this.THETA) * this.radiusModify(this.radius) ;
    }

    viewMatrix() {
        this.move();
        const look = [0,0,1] ;
		let cameraMatrix= m4.lookAt(this.position, look, this.up);
        return m4.inverse(cameraMatrix); // ViewMatrix
	}
}
