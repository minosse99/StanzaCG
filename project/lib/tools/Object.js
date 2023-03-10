let ampWaveLimiter = 0.0025;
let rotMatZ = m4.zRotation(0.01);
let rotMatX = m4.xRotation(0.04);
let rotMat = m4.multiply(rotMatX, rotMatZ);

export class Object{
	
	constructor(alias, mesh, offsets,rotate) {
		
		this.alias = alias; 
		this.mesh = mesh; 
		this.position = {
			x: offsets.x, 
			y: offsets.y, 
			z: offsets.z, 
		};
		this.offdeltaY = 0;
		this.ampWaveLimiter = 0.004;
		if (rotate){ 
			let rotMatX = m4.xRotation(0.04);
			this.rotMat = rotMatX;
			this.rotate = true;
			
			this.compute_position();
        }
	 
	}

	compute_position() {
		for (let i = 0; i < this.mesh.positions.length; i += 3) {
			this.mesh.positions[i] += parseFloat(this.position.z);
			this.mesh.positions[i + 1] += parseFloat(this.position.x);
			this.mesh.positions[i + 2] += parseFloat(this.position.y);
		}
	}

	compute_idleAnimation(deltaY) {
		this.offdeltaY = deltaY;
		for (let i = 0; i < this.mesh.positions.length; i += 3) {
			var pos = [];
			var nor = [];

			this.mesh.positions[i + 2] += deltaY;
			pos.push(this.mesh.positions[i + 1] - this.position.x);
			pos.push(this.mesh.positions[i + 2] - 0.1 - this.position.y);
			pos.push(this.mesh.positions[i] - this.position.z);
			nor.push(this.mesh.normals[i + 1]);
			nor.push(this.mesh.normals[i + 2]);
			nor.push(this.mesh.normals[i]);

			var pos_res = m4.transformPoint(rotMat, pos);
			var nor_res = m4.transformPoint(rotMat, nor);

			this.mesh.positions[i + 1] = pos_res[0] + this.position.x;
			this.mesh.positions[i + 2] = pos_res[1] + 0.1 + this.position.y;
			this.mesh.positions[i] = pos_res[2] + this.position.z;
			this.mesh.normals[i + 1] = nor_res[0];
			this.mesh.normals[i + 2] = nor_res[1];
			this.mesh.normals[i] = nor_res[2];
		}

	}


	render(time, gl, light, program, camera, trasparenzaPareti) {
		
		/********************************************************************************************/
		gl.useProgram(program);
		if (this.rotate == true  ){
			this.compute_idleAnimation(Math.sin(time) * 0.01);
            
        }
		let positionLocation = gl.getAttribLocation(program, "a_position");
		let normalLocation = gl.getAttribLocation(program, "a_normal");
		let texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
		this.positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(this.mesh.positions),
			gl.STATIC_DRAW
		);
		this.normalsBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(this.mesh.normals),
			gl.STATIC_DRAW
		);
		this.texcoordBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array(this.mesh.texcoords),
			gl.STATIC_DRAW
		);
		
		gl.uniform3fv(gl.getUniformLocation(program, "diffuse"), this.mesh.diffuse);
		gl.uniform3fv(gl.getUniformLocation(program, "ambient"), this.mesh.ambient);
		gl.uniform3fv(
			gl.getUniformLocation(program, "specular"),
			this.mesh.specular
		);
		gl.uniform3fv(
			gl.getUniformLocation(program, "u_ambientLight"),
			light.ambientLight
		);
		gl.uniform3fv(
			gl.getUniformLocation(program, "u_colorLight"),
			light.colorLight
		);
		gl.uniform1f(
			gl.getUniformLocation(program, "shininess"),
			this.mesh.shininess
		);
		gl.uniform1f(gl.getUniformLocation(program, "opacity"), this.mesh.opacity);
		
		if((this.alias === "pareteCx" && trasparenzaPareti[0]) || (this.alias === "pareteDx" && trasparenzaPareti[1]) ||  (this.alias === "pareteSx" && trasparenzaPareti[2]) ){
			gl.uniform1f(gl.getUniformLocation(program, "uAlpha"), 0.2);
		}else
			gl.uniform1f(gl.getUniformLocation(program, "uAlpha"), 1.0);
		gl.enableVertexAttribArray(positionLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		const size = 3; // 3 components per iteration
		const type = gl.FLOAT; // the data is 32bit floats
		const normalize = false; // don't normalize the data
		const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
		const offset = 0; // start at the beginning of the buffer
		gl.vertexAttribPointer(
			positionLocation,
			size,
			type,
			normalize,
			stride,
			offset
		);
		gl.enableVertexAttribArray(normalLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer);
		gl.vertexAttribPointer(
			normalLocation,
			size,
			type,
			normalize,
			stride,
			offset
		);
		gl.enableVertexAttribArray(texcoordLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
		gl.vertexAttribPointer(
			texcoordLocation,
			size - 1,
			type,
			normalize,
			stride,
			offset
		);

		let matrixLocation = gl.getUniformLocation(program, "u_world");
		let textureLocation = gl.getUniformLocation(program, "diffuseMap");
		let viewMatrixLocation = gl.getUniformLocation(program, "u_view");
		let projectionMatrixLocation = gl.getUniformLocation(
			program,
			"u_projection"
		);
		let lightWorldDirectionLocation = gl.getUniformLocation(
			program,
			"u_lightDirection"
		);
		let viewWorldPositionLocation = gl.getUniformLocation(
			program,
			"u_viewWorldPosition"
		);
		gl.uniformMatrix4fv(viewMatrixLocation, false, camera.viewMatrix());
		gl.uniformMatrix4fv(
			projectionMatrixLocation,
			false,
			camera.projectionMatrix(gl)
		);

		// set the light position
		gl.uniform3fv(lightWorldDirectionLocation, m4.normalize([0, 2,0]));

		// set the camera/view position
		gl.uniform3fv(viewWorldPositionLocation, camera.position);

		// Tell the shader to use texture unit 0 for diffuseMap
		gl.uniform1i(textureLocation, 0);

		let vertNumber = this.mesh.numVertices;
		
		drawScene(0, this.mesh);
		
		// compute the world matrix
       
		// Draw the scene.
		function drawScene(time, mesh) {
			gl.bindTexture(gl.TEXTURE_2D, mesh.mainTexture);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

			let matrix = m4.identity();
			gl.uniformMatrix4fv(matrixLocation, false, matrix);

			gl.drawArrays(gl.TRIANGLES, 0, vertNumber);
		}
	}
	
}
