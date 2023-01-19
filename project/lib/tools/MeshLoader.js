import { Object } from "./Object.js";

export class MeshLoader {
	constructor(objData) {
		this.objData = objData;
	}

	addMesh(gl, alias, pathOBJ, coords, rotate) {
		let mesh = [];
		mesh.sourceMesh = pathOBJ;

		LoadMesh(gl, mesh);

		this.objData.push(new Object(alias, mesh, coords, rotate));
	}

}
