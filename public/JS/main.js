
import { Scene } from "./JSTools/Scene.js";
import { Core, initProgramRender, render } from "./JSTools/Core.js";


console.log("main.js - Start loading scene elements");

// Array of objects that will be rendered in the scene 
let sceneComposition = new Scene();
// Counter for the number of objects that have to be added to the scene


sceneComposition.sceneObj.push( {
    alias: "scimmia",
    pathOBJ: "./OBJModels/scimmia.obj",
    coords: { x: 2, y: 11, z: 7 },
    rotate:  true
});
sceneComposition.sceneObj.push( {
    alias: "lampada",
    pathOBJ: "./OBJModels/lampada.obj",
    coords: { x: 0, y: 0, z: 0 },
    rotate:  false
});
sceneComposition.sceneObj.push( {
    alias: 'mensola',
    pathOBJ: "./OBJModels/mensola.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});
sceneComposition.sceneObj.push( {
    alias: "Pavimento",
    pathOBJ: "./OBJModels/Pavimento.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});
sceneComposition.sceneObj.push( {
    alias: "sediaAx",
    pathOBJ: "./OBJModels/sediaAx.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});
sceneComposition.sceneObj.push( {
    alias: "sediaDX",
    pathOBJ: "./OBJModels/sediaDX.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});
sceneComposition.sceneObj.push( {
    alias: "sediaBx",
    pathOBJ: "./OBJModels/sediaBx.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});
sceneComposition.sceneObj.push( {
    alias: "sediaLX",
    pathOBJ: "./OBJModels/sediaLX.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});
sceneComposition.sceneObj.push( {
    alias: "tavolo",
    pathOBJ: "./OBJModels/tavolo.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});
sceneComposition.sceneObj.push( {
    alias: "tv",
    pathOBJ: "./OBJModels/tv.obj",
    coords: { x: 12, y: 4, z: 6 },rotate:  false
});
sceneComposition.sceneObj.push( {
    alias: "divano",
    pathOBJ: "./OBJModels/divano.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});
sceneComposition.sceneObj.push( {
    alias: "pareteSx",
    pathOBJ: "./OBJModels/pareteSx.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});sceneComposition.sceneObj.push( {
    alias: "pareteDx",
    pathOBJ: "./OBJModels/pareteDx.obj",
    coords: { x: 0, y:0 , z: 0 },rotate:  false
});sceneComposition.sceneObj.push( {
    alias: "pareteCx",
    pathOBJ: "./OBJModels/pareteCx.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});

console.debug(sceneComposition);

console.log("main.js - End loading scene elements");



console.log("main.js - Start loading core");

let core = new Core("screenCanvas");

core.setupScene(sceneComposition);

core.generateCamera();

console.log("Core del programma dopo il caricamento della scena");
console.debug(core);

console.log("main.js - End loading core");
console.log("main.js - Loop rendering");	

initProgramRender();
render();
