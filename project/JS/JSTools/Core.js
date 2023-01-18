
import { MeshLoader } from "./MeshLoader.js";

import { Camera, setCameraControls,makeKeyCanvas} from "./Camera.js";
import { degToRad,radToDeg,createXYQuadVertices,projectionMatrix,isSmartphone, makeText} from "../utils.js";
import { AnimatedCamera } from "./AnimatedCamera.js";
import {CameraSmartphone,setCameraControlSmartphone, getUpdateCamera} from "./CameraSmartphone.js";


// WebGL context
let gl;

// Camera
let camera;
// List of objects to render
let meshlist = [];
let listPrograms = [];
var skybox = [];
let quadBufferInfo;
let mainCanvas;
let trasparenzaPareti = [false , false,false];
let lookAt = false;
let listObjectToLook =[{alias:'center', coords: {x:0, y:0, z:0}}];
// TODO: Evaluate if this is the best way to do this
let moveVectore;
let positionLocation,skyboxLocation,viewDirectionProjectionInverseLocation;

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
		this.gl = this.mainCanvas.getContext("webgl");
		// Global variables initialization
		gl = this.gl;
		if (!this.gl) return;
		gl.getExtension("OES_standard_derivatives");
		this.gl.getExtension('WEBGL_depth_texture');
		
		this.meshlist = [];
		this.meshLoader = new MeshLoader(this.meshlist);
		// Global variables initialization
		meshlist = this.meshlist;
 
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
				this.gl,
				obj.alias,
				obj.pathOBJ,
				obj.coords,
				obj.rotate
			);
			if(obj.alias === "tv"  || obj.alias ==="tavolo" ){
				listObjectToLook.push(obj);
			}else if(obj.alias === "scimmia"){
				obj.coords= [2,11,7];
				listObjectToLook.push(obj);
			}
		}
		document.getElementById('selectLookat').innerHTML = listObjectToLook.map((obj) => `<option value="${obj.alias}">${obj.alias}</option>`).join('');

		
	}

	
	async prepareSkybox(){
		if(!isSmartphone(mainCanvas)){
			console.log("Core.js - Start skybox setup");
			skybox.programInfo = webglUtils.createProgramInfo(gl, ["skybox-vertex-shader", "skybox-fragment-shader"]);

			const arrays2 = createXYQuadVertices.apply(null,  Array.prototype.slice.call(arguments, 1));
			quadBufferInfo = webglUtils.createBufferInfoFromArrays(gl, arrays2);
			// Create a texture.
			skybox.texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, skybox.texture);
		
			const faceInfos = [
			{
				target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
				url: './models/img/posx.jpg',
			},
			{
				target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
				url: './models/img/negx.jpg',
			},
			{
				target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
				url: './models/img/posy.jpg',
			},
			{
				target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
				url: './models/img/negy.jpg',
			},
			{
				target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
				url: './models/img/negz.jpg',
			},
			{
				target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
				url: './models/img/posz.jpg',
			},
			];
			faceInfos.forEach((faceInfo) => {
			const {target, url} = faceInfo;
		
			// Upload the canvas to the cubemap face.
			const level = 0;
			const internalFormat = gl.RGBA;
			const width = 512;
			const height = 512;
			const format = gl.RGBA;
			const type = gl.UNSIGNED_BYTE;
		
			// setup each face so it's immediately renderable
			gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
		
			// Asynchronously load an image
			const image = new Image();
			image.src = url;
			image.addEventListener('load', function() {
				// Now that the image has loaded make copy it to the texture.
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, skybox.texture);
				gl.texImage2D(target, level, internalFormat, format, type, image);
				gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
			});
			});
			gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		}
	}
	/**
	 * Function that generates the camera for the rendering.
	 * 
	 */
	generateCamera() {
		console.log("Core.js - Start camera setup");

		const position = [-19,8,5], target = [0, 1, 0], up = [0, 1, 0];
		if(!isSmartphone(this.mainCanvas)){
			console.log("is not smartphone")
			camera = new Camera(position, target, up);
			setCameraControls(this.mainCanvas,camera,lookAt);
			var canvas2dC = document.getElementById("canvas2DCommand");
			var contextC = canvas2dC.getContext("2d");
			makeKeyCanvas(contextC,canvas2dC,camera);

		}else{
			camera = new CameraSmartphone(position, target, up,70);
			setCameraControlSmartphone(this.mainCanvas)
		}
		mainCanvas = this.mainCanvas;
		
	}
	
}

document.getElementById('switch_camera').onclick = function() {
	const position = [-47,7,3], target = [0, 1, 0], up = [0, 1, 0];
	if (camera instanceof AnimatedCamera){
		if(!isSmartphone(mainCanvas)){
			camera = new Camera(position, target, up,70);
			setCameraControls(mainCanvas,camera,lookAt);
		}else{
			camera = new CameraSmartphone(position, target, up,70);
			setCameraControlSmartphone(mainCanvas)
			camera.moveCamera();
		}
		
	}else{
		camera = new AnimatedCamera();
	}
}

export function initProgramRender() {
	// setup GLSL program
	let mainProgram = webglUtils.createProgramFromScripts(gl, [
		"3d-vertex-shader",
		"3d-fragment-shader",
	]);

	
	listPrograms = [[mainProgram, gl]];

	var canvas2dT = document.getElementById("canvas2DText");
	var contextT = canvas2dT.getContext("2d");
	makeText(contextT,canvas2dT);
	//drawSkybox(gl,skybox.programInfo, camera.viewMatrix(),projectionMatrix(gl));
	document.getElementById('selectLookat').addEventListener("change", (e) => {
		let select = document.getElementById('selectLookat');
		let obj = listObjectToLook.find((obj) => obj.alias === select.value);
		camera.setLookAt(obj.coords);
	});

	
}

/**
 * Rendering functions for the main screen.
 * 
 * @param {*} time 
 */
export function render(time = 0) {
	time *= 0.002;
	
	gl.enable(gl.CULL_FACE);
   	gl.enable(gl.DEPTH_TEST);
   	gl.enable(gl.BLEND);
   	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	resizeCanvasToDisplaySize(gl.canvas);
    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	
	gl.depthFunc(gl.LESS);
	if(camera instanceof CameraSmartphone)getUpdateCamera(camera);
	for (const program of listPrograms) {
		
		// Convert to seconds
		time *= 0.002;
		meshlist.forEach((elem) => {
			elem.render(
				time,
				program[1],
				{ ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] },
				program[0],
				camera,
				trasparenzaPareti
			);			
		}
		);
		
		
	}
	if(!isSmartphone(mainCanvas)){
		gl.depthFunc(gl.LEQUAL);
		var projectionMatrix =
		camera.projectionMatrix(gl);

		var cameraMatrix = camera.viewMatrix();
		var viewMatrix = cameraMatrix;
		var viewDirectionMatrix = m4.copy(viewMatrix);
		viewDirectionMatrix[12] = 0;
		viewDirectionMatrix[13] = 0;
		viewDirectionMatrix[14] = 0;

		var viewDirectionProjectionMatrix =
			m4.multiply(projectionMatrix, viewDirectionMatrix);
		var viewDirectionProjectionInverseMatrix =
			m4.inverse(viewDirectionProjectionMatrix);

		gl.useProgram(skybox.programInfo.program);
		webglUtils.setBuffersAndAttributes(gl, skybox.programInfo, quadBufferInfo);
		webglUtils.setUniforms(skybox.programInfo, {
			u_viewDirectionProjectionInverse: viewDirectionProjectionInverseMatrix,
			u_skybox: skybox.texture
		});
		webglUtils.drawBufferInfo(gl, quadBufferInfo);
	}
	requestAnimationFrame(render);
}


/** =====================EVENT HANDLER ======================================= */

document.getElementById('lookat').addEventListener("click", (e) => {
	let select = document.getElementById('selectLookat');
	
	if(select.disabled){
		select.attributes.removeNamedItem('disabled');
		
		let obj = listObjectToLook.find((obj) => obj.alias === select.value);
		camera.setLookAt(obj.coords);
		
	}else{
		select.disabled = true;
		camera.disableLookAt();
	}
		
	
});

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


function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    const needResize = canvas.width !== displayWidth ||
        canvas.height !== displayHeight;

    if (needResize) {
        // Make the canvas the same size
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }

    return needResize;
}
