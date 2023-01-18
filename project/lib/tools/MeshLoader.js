import { Object } from "./Object.js";

export class MeshLoader {

	/**
	 * Constructor of the class. 
	 * It initializes the list of all objects in the scene.
	 * 
	 * @param {List} objData List of all objects in the scene.
	 */
	constructor(objData) {
		this.objData = objData;
	}

	/**
	 * Load the mesh from the .obj file and add it to the list of objects specialized.
	 * 
	 * @param {Object} glMainScreen WebGL context of the main screen.
	 * @param {String} alias A string that will be used to identify the object.
	 * @param {String} pathOBJ The path to the .obj file.
	 * @param {Object} coords An object that contains the coordinates of the object inside the scene.
	 */
	addMesh(glMainScreen, alias, pathOBJ, coords, rotate) {

//		console.log("MeshLoader.js - Loading mesh: " + alias);

		// Create the mesh object
		let mesh = [];
		mesh.sourceMesh = pathOBJ;

		// Load the mesh from the .obj file
		LoadMesh(glMainScreen, mesh);

		// Add the mesh to the list of objects
		this.objData.push(
			new Object(alias, mesh, coords, rotate));
	
	}

}
