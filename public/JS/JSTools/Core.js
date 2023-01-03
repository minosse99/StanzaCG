
import { MeshLoader } from "./MeshLoader.js";

import { Camera, setCameraControls, getUpdateCamera ,getanimateCamera} from "./Camera.js";

// WebGL context
let glMainScreen;

let isMainScreen = true;
// Camera
let cameraMainScreen;

let actCamera;
// List of objects to render
let meshlist = [];

let listPrograms = [];
let trasparenzaPareti = [false , false,false];


// TODO: Evaluate if this is the best way to do this
let moveVectore;

export class Core {

	/**
	 * Constructor of the class. 
	 * It initializes the canvas, the WebGL context and all the components for the rendering.
	 * 
	 * @param {String} idMainCanvas Identifier of the canvas element (Main screen).
	 */
	constructor(idMainCanvas) {
		console.log("Core.js - Start WebGL Core initialization");

		// Canvas and WebGL context initialization
		this.mainCanvas = document.getElementById(idMainCanvas);
		this.glMainScreen = this.mainCanvas.getContext("webgl");
		// Global variables initialization
		glMainScreen = this.glMainScreen;
		
		if (!this.glMainScreen) return;

		// MeshLoader initialization
		this.meshlist = [];
		this.meshLoader = new MeshLoader(this.meshlist);
		// Global variables initialization
		meshlist = this.meshlist;

		// Movement and camera controls initialization

		
		setCameraControls(this.mainCanvas, true);
		// Global variables initialization
		moveVectore = this.moveVectore;

		console.log("Core.js - End WebGL Core initialization");
	}

	/**
	 * Function setup all the components for the rendering.
	 * 
	 * @param {List} sceneComposition List of objects that will be rendered in the scene.
	 */
	setupScene(sceneComposition) {
		console.log("Core.js - Start scene setup");

		// Load all the meshes in the scene
		for (const obj of sceneComposition.sceneObj) {
			// Load the mesh
			this.meshLoader.addMesh(
				this.glMainScreen,
				obj.alias,
				obj.pathOBJ,
				obj.coords
			);
		}

		console.log("Core.js - End scene setup");
	}

	/**
	 * Function that generates the camera for the rendering.
	 * 
	 */
	generateCamera() {
		console.log("Core.js - Start camera setup");

		cameraMainScreen = new Camera(
			[0, 20, 0],
			[0, 0, 1],
			[0, 0, 1],
			70
		);

		console.log("Core.js - End camera setup");
	}

}

document.getElementById("cx").addEventListener("change", (e) => {
	if(document.getElementById("cx").checked){
		trasparenzaPareti[0] = true;
	}else{
		trasparenzaPareti[0] = false;
	}
	
});

document.getElementById("dx").addEventListener("change", (e) => {
	if(document.getElementById("dx").checked){
		trasparenzaPareti[1] = true;
	}else{
		trasparenzaPareti[1] = false;
	}
});


document.getElementById("sx").addEventListener("change", (e) => {
	if(document.getElementById("sx").checked){
		trasparenzaPareti[2] = true;
	}else{
		trasparenzaPareti[2] = false;
	}
});
document.getElementById("radius").addEventListener("input", (e) => {
	console.log(cameraMainScreen.getRadius());
	cameraMainScreen.setRadius(e.target.value);
		
});


document.getElementById("theta").addEventListener("input", (e) => {
	//console.log(cameraMainScreen.getTheta());
	cameraMainScreen.setTheta(e.target.value);
		
});
document.getElementById("phi").addEventListener("input", (e) => {
	//console.log(cameraMainScreen.getRadius());
	cameraMainScreen.setPhi(e.target.value);
		
});


export function initProgramRender() {
	// setup GLSL program
	let mainProgram = webglUtils.createProgramFromScripts(glMainScreen, [
		"3d-vertex-shader",
		"3d-fragment-shader",
	]);


	glMainScreen.enable(glMainScreen.BLEND);

    glMainScreen.blendFunc(glMainScreen.SRC_ALPHA, glMainScreen.ONE_MINUS_SRC_ALPHA);
	glMainScreen.enable(glMainScreen.DEPTH_TEST);	
	glMainScreen.useProgram(mainProgram);
	
	
    
	// List of list of programs
	listPrograms = [[mainProgram, glMainScreen]];

	actCamera = cameraMainScreen;
}

/**
 * Rendering functions for the main screen.
 * 
 * @param {*} time 
 */
export function render(time = 0) {
	
	for (const program of listPrograms) {
				
		if (getUpdateCamera() || getanimateCamera()) cameraMainScreen.moveCamera();
		
		// Convert to seconds
		time *= 0.002;
		
		meshlist.forEach((elem) => {
			elem.render(
				time,
				program[1],
				{ ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] },
				program[0],
				actCamera,
				isMainScreen,
				trasparenzaPareti
			);			
		}
		);

	}

	requestAnimationFrame(render);
}
