"use strict"
	// Load cubemap texture for skybox
	async function prepareSkybox(skybox,gl){
		const arrays2 = createXYQuadVertices.apply(null,  Array.prototype.slice.call(arguments, 1));
		skybox.quadBufferInfo = webglUtils.createBufferInfoFromArrays(gl, arrays2);
		skybox.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, skybox.texture);

		const faceInfos = [
			{
				target: gl.TEXTURE_CUBE_MAP_POSITIVE_X,
				url: './OBJModels/img/skybox/pos-x.jpg',
			},
			{
				target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
				url: './OBJModels/img/skybox/neg-x.jpg',
			},
			{
				target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
				url: './OBJModels/img/skybox/pos-y.jpg',
			},
			{
				target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
				url: './OBJModels/img/skybox/neg-y.jpg',
			},
			{
				target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
				url: './OBJModels/img/skybox/pos-z.jpg',
			},
			{
				target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
				url: './OBJModels/img/skybox/neg-z.jpg',
			},

		];

		faceInfos.forEach((faceInfo) => {
			const {target, url} = faceInfo;

			const level = 0;
			const internalFormat = gl.RGBA;
			const width = gl.clientWidth;
			const height = gl.clientHeight;
			const format = gl.RGBA;
			const type = gl.UNSIGNED_BYTE;
			gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

			const image = new Image();
			image.src = url;

			let glMainScreen = gl;
			

			image.addEventListener('load', function() {
				// Now that the image has loaded make copy it to the texture.
				console.log("load");
				glMainScreen.bindTexture(glMainScreen.TEXTURE_CUBE_MAP, skybox.texture);
				glMainScreen.texImage2D(target, level, internalFormat, format, type, image);
				glMainScreen.generateMipmap(glMainScreen.TEXTURE_CUBE_MAP);
			});
		});
		gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		return skybox;
	}

	function degToRad(d) {
		return d * Math.PI / 180;
	}

	function radToDeg(r) {
		return r * 180 / Math.PI;
	}

	function  projectionMatrix(gl){
		let fieldOfViewRadians = degToRad(70);
		let aspect =gl.canvas.clientWidth / gl.canvas.clientHeight;
		let zmin=0.1;
		return m4.perspective(fieldOfViewRadians, aspect, zmin, 200);
	}
	
	function drawSkybox(gl, skybox, view, projection) {
		
		//if(skybox.quadBufferInfo != null ){
			view[12] = 0;
			view[13] = 0;
			view[14] = 0;
		
			console.log("Draw Sky box");
			//let viewMatrix = m4.inverse(view)
			gl.depthFunc(gl.LEQUAL) //non so perchè è necessario per lo skybox
			gl.useProgram(skybox.programInfo.program);
			let viewDirectionProjectionMatrix = m4.multiply(projection, view)
			let viewDirectionProjectionInverse = m4.inverse(viewDirectionProjectionMatrix)
			webglUtils.setBuffersAndAttributes(gl, skybox.programInfo,  skybox.quadBufferInfo)
			webglUtils.setUniforms(skybox.programInfo , {
				u_viewDirectionProjectionInverse: viewDirectionProjectionInverse,
				u_skybox: skybox.texture,
			})
			
			webglUtils.drawBufferInfo(gl, skybox.quadBufferInfo)
			gl.depthFunc(gl.LESS);
		//}
	}

	function createXYQuadVertices() {
		let xOffset = 0;
		let yOffset = 0;
		let size = 1;
		return {
			position: {
				numComponents: 2,
				data: [
					xOffset + -1 * size, yOffset + -1 * size,
					xOffset +  1 * size, yOffset + -1 * size,
					xOffset + -1 * size, yOffset +  1 * size,
					xOffset +  1 * size, yOffset +  1 * size,
				],
			},
			normal: [
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
				0, 0, 1,
			],
			texcoord: [
				0, 0,
				1, 0,
				0, 1,
				1, 1,
			],
			indices: [ 0, 1, 2, 2, 1, 3 ],
		};
	}

	function isSmartphone(canvas) {
		return (canvas.clientHeight > 400 && canvas.clientWidth > 400);
	}
	
	export {prepareSkybox,degToRad,radToDeg,createXYQuadVertices,drawSkybox,projectionMatrix,isSmartphone};