
import { Scene } from "./tools/Scene.js";
import { Core, initProgramRender, render } from "./tools/Core.js";
import { loadJson } from "./utils.js";
let sceneComposition = new Scene();

//Load Element to compose the scene from scene.json
let listElem = await loadJson("./lib/scene.json");

//Init Core
sceneComposition.addList(listElem);

let core = new Core();
core.initScene(sceneComposition);
core.initCamera();
core.prepareSkybox().then(() => {});

//Rendering
initProgramRender();
render();
