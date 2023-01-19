export class Scene {

	constructor(name = "default", sceneObj = []) {
		this.sceneName;
		this.sceneObj = sceneObj;
	}

	addElement(listofObjects) {
		listofObjects.forEach(elem => {
			var newObj = {
				alias: elem,
				pathOBJ: "./models/" + elem +".obj",
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
