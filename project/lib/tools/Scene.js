export class Scene {

	constructor(name = "default", sceneObj = []) {
		this.sceneName;
		this.sceneObj = sceneObj;
	}

	addList(listofObjects) {
		listofObjects.forEach(elem => {
			var newObj = {
				alias: elem.alias,
				pathOBJ: "./project/models/" + elem.alias +".obj",
				coords: { x: elem.coords.x, y: elem.coords.y , z: elem.coords.z },
				rotate:  elem.rotate
			};
			if (this.sceneObj.push(newObj)) {
				console.log("Scene.js - add ",newObj.alias," to the scene");
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
