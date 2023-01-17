
import { Scene } from "./JSTools/Scene.js";
import { Core, initProgramRender, render } from "./JSTools/Core.js";

import { Camera } from "./JSTools/Camera.js";

let sceneComposition = new Scene();
sceneComposition.sceneObj.push( {
    alias: "scimmia",
    pathOBJ: "./models/scimmia.obj",
    coords: { x: 7.5, y: 2, z: 11 },
    rotate:  true
});

sceneComposition.sceneObj.push( {
    alias: 'mensola',
    pathOBJ: "./models/mensola.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});

sceneComposition.sceneObj.push( {
    alias: "Pavimento",
    pathOBJ: "./models/Pavimento.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});

sceneComposition.sceneObj.push( {
    alias: "sediaAx",
    pathOBJ: "./models/sediaAx.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});

sceneComposition.sceneObj.push( {
    alias: "sediaDX",
    pathOBJ: "./models/sediaDX.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});
sceneComposition.sceneObj.push( {
    alias: "sediaBx",
    pathOBJ: "./models/sediaBx.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});
sceneComposition.sceneObj.push( {
    alias: "sediaLX",
    pathOBJ: "./models/sediaLX.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});
sceneComposition.sceneObj.push( {
    alias: "tavolo",
    pathOBJ: "./models/tavolo.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});

sceneComposition.sceneObj.push( {
    alias: "tv",
    pathOBJ: "./models/tv.obj",
    coords: { x: 12, y: 4, z: 6 },rotate:  false
});

sceneComposition.sceneObj.push( {
    alias: "divano",
    pathOBJ: "./models/divano.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});
sceneComposition.sceneObj.push( {
    alias: "pareteSx",
    pathOBJ: "./models/pareteSx.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});sceneComposition.sceneObj.push( {
    alias: "pareteDx",
    pathOBJ: "./models/pareteDx.obj",
    coords: { x: 0, y:0 , z: 0 },rotate:  false
});sceneComposition.sceneObj.push( {
    alias: "pareteCx",
    pathOBJ: "./models/pareteCx.obj",
    coords: { x: 0, y: 0, z: 0 },rotate:  false
});

let core = new Core("canvas");

core.setupScene(sceneComposition);


core.generateCamera();

core.prepareSkybox().then(() => {});

initProgramRender();
render();
