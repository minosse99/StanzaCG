
// Note:	In Javascript, the "export" keyword permits to export the class to other files.
//			When we export the class, we can use all the methods and properties of the class in other 
//			files.
export class Scene {

	/**
	 * Costuctor of the class.
	 * 
	 * @param {string} name - The name of the scene.
	 * @param {object} sceneObj - An array of objects that will be rendered in the scene.
	 */
	constructor(name = "defaultSceneComposition", sceneObj = []) {
		this.sceneName;
		this.sceneObj = sceneObj;
	}

/**
 * 
 * @param {List<String>} name of the objects to be load 
 * 
 * The function load the objects in the scene with alias the same name and search it as pathOBJ 
 */
	addElement(listofObjects) {
		listofObjects.forEach(elem => {
			var newObj = {
				alias: elem,
				pathOBJ: "./OBJModels/" + elem +".obj",
				coords: { x: 0, y: 0, z: 0 }
			};
			if (this.sceneObj.push(newObj)) {
				console.log("Scene.js - Added new object to the scene");
			} else {
				console.log("Scene.js - Error while adding new object to the scene");
				console.debug(newObj);
			}
		});
	}

	
	/**
	 * Remove an object from the scene.
	 * 
	 * @param {string} alias - The alias of the object that will be removed
	 * 
	 * @returns {boolean} - True if the object has been removed, false otherwise
	 * 
	 */
	removeOBJFromList(alias) {
		for (var i = 0; i < this.sceneObj.length; i++) {
			if (this.sceneObj[i].alias === alias) {
				this.sceneObj.splice(i, 1);
				return true;
			}
		}
		return false;
	}

}
