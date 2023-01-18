"use strict"
	function degToRad(d) {
		return d * Math.PI / 180;
	}

	function radToDeg(r) {
		return r * 180 / Math.PI;
	}

function makeText(context,canvas){
	let commands = [
	"Premi W/S per muoverti in avanti/indietro",
	"Premi A/D per muoverti a sinistra/destra",
	"Premi Q/E per muoverti in alto/basso",
	"Premi G/K per ruotare a destra/sinistra",	
	"Premi U/J per ruotare in alto/basso",
	"Premi L per resettare l'inclinazione",
	"Premi le frecce per muovere la visuale",
	"Premi la rotellina del mouse per zoomare",
];
	
	context.font = "15px Arial";

      context.fillStyle = "white";
    let size = 22;
    var gap = 16;
	commands.forEach(element => {
		context.fillText(element, 0, size + gap);
		size += gap;
	});
}
	function  projectionMatrix(gl){
		let fieldOfViewRadians = degToRad(70);
		let aspect =gl.canvas.clientWidth / gl.canvas.clientHeight;
		let zmin=0.1;
		return m4.perspective(fieldOfViewRadians, aspect, zmin, 200);
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
		return (canvas.clientHeight < 400 || canvas.clientWidth < 400);
	}
	
	
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
	
	function makeButton(id, x, y, w, h, label, fill, stroke, labelcolor, clickFn, releaseFn) {
        var button = new Path2D();
        button.rect(x, y, w, h);
        button.x = x;
        button.y = y;
        button.w = w;
        button.h = h;
        button.id = id;
        button.label = label;
        button.fill = fill;
        button.stroke = stroke;
        button.labelcolor = labelcolor;
        button.clickFn = clickFn;
        button.releaseFn = releaseFn;
        return button;
    }

export {degToRad,radToDeg,createXYQuadVertices,makeText,projectionMatrix,isSmartphone,resizeCanvasToDisplaySize,makeButton};