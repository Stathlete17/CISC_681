let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let mat;
let box;


function createScene() {
    box = randomBoxes(100, 2, 25, 2, 80);
    let light = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light.position.set(0, 0, 40);
    let light2 = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light2.position.set(20, 40, -40);
    let ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(light);
    scene.add(light2);
    scene.add(ambientLight);
    scene.add(box);
}

function randomBoxes(nbrBoxes, minSide, maxSide, minHeight, maxHeight)
{
let root = new THREE.Object3D();
let floor = makeFloor();
root.add(floor);


for (let i = 0; i < nbrBoxes; i++) {
let matArgs = {color: getRandomColor().setHSL(Math.random(), (Math.random() * (0.92 - 0.8) + 0.8),  (Math.random() * (0.6 - 0.3) + 0.3) ) , transparent: true, opacity: 0.7};
mat = new THREE.MeshLambertMaterial(matArgs);
let y = getRandomInt(minHeight, maxHeight);
let geometry = new THREE.BoxGeometry( (Math.random() * (maxSide - minSide) + minSide), y, (Math.random() * (maxSide - minSide) + minSide));
let thisBox = new THREE.Mesh(geometry, mat);

	// position
	let x = (Math.random()*(85 - -85) + -85);
	let z = (Math.random()*(85 - -85) + -85);
	thisBox.position.set(x,y-y/2, z) ;

	root.add(thisBox);
}

return root;
}


function makeFloor() {
    let color = new THREE.Color(0x333333);
    let matArgs = {color: color, transparent: true, opacity: 0.9};
    let mat = new THREE.MeshBasicMaterial(matArgs);
    let geom = new THREE.BoxGeometry(200, 0, 200);
    let floor = new THREE.Mesh(geom, mat);
    return floor;
}



let controls = new function() {
    this.nbrBoxes = 100;
}

function initGui() {
    let gui = new dat.GUI();
    gui.add(controls, 'nbrBoxes', 0, 200).step(10).onChange(update);

}

function init() {
	let canvasWidth = window.innerWidth;
	let canvasHeight = window.innerHeight;
	let canvasRatio = canvasWidth / canvasHeight;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({antialias : true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor(0x000000, 1.0);
    renderer.setAnimationLoop(function () {
        render();
    });

    camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
    camera.position.set(180, 180, 180);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
}


function update() {
	let nbrBoxes = controls.nbrBoxes;
	scene.remove(box);
    box = randomBoxes(nbrBoxes);
    scene.add(box);
}



function render() {
    let delta = clock.getDelta();
    cameraControls.update(delta);
    mat.color = new THREE.Color(controls.color);
    mat.opacity = controls.opacity;
    renderer.render(scene, camera);
}





function addToDOM() {
	let container = document.getElementById('container');
	let canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}



init();
createScene();
initGui();
addToDOM();

