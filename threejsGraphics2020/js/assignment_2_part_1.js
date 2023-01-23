let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let root = null;

function createSceneA() {
	let root = makeTorus(900, 12,2, 57,2);
	scene.add(root);

}


function makeTorus(nbrBursts, mjrRadius, mnrRadius, maxRays, maxRad){
	let root = new THREE.Object3D();
	let geom = new THREE.TorusGeometry(mjrRadius, mnrRadius, 50, 1000);
	let maxLength = geom.vertices.length;

for (let i = 0; i < nbrBursts; i++) {
        let t = getRandomInt(1,maxLength);
        let vertex = geom.vertices[t];
		let mesh = starburstA(maxRays,maxRad);
        mesh.position.set(vertex.x , vertex.z , vertex.y);
		root.add(mesh);
	}
return root;

}

function starburstA(maxRays, maxRad) {
    let rad = 1;
    let origin = new THREE.Vector3(0, 0, 0);
    let innerColor = getRandomColor(0.8, 0.1, 0.8);
    let black = new THREE.Color(0x000000);
    let geom = new THREE.Geometry();
    let nbrRays = getRandomInt(1, maxRays);
     for (let i = 0; i < nbrRays; i++) {
            let r = rad * getRandomFloat(0.1, maxRad);
            let dest = getRandomPointOnSphere(r);
            geom.vertices.push(origin, dest);
            geom.colors.push(innerColor, black);
        }
    let args = {vertexColors: true, linewidth: 2};
    let mat = new THREE.LineBasicMaterial(args);
    return new THREE.Line(geom, mat, THREE.LineSegments);
}


function animate() {
	window.requestAnimationFrame(animate);
	render();
}


let controls = new function() {
    this.mjrRadius = 10;
    this.mnrRadius = 1.5;
    this.nbrBursts = 400;
    this.burstRadius = 1.0;
    this.maxRays = 100;
    this.Go = update;
}

function initGui() {
    let gui = new dat.GUI();
    gui.add(controls, 'mjrRadius', 2, 20).step(1).name('Major Radius');
    gui.add(controls, 'mnrRadius', 0.1, 10).step(.1).name('Minor Radius');
    gui.add(controls, 'nbrBursts', 5, 2000).step(5).name('Nbr of bursts');
    gui.add(controls, 'burstRadius', 0.1, 5.0).name('Burst radius');
    gui.add(controls, 'maxRays', 5, 200).name('Max nbr of rays');
    gui.add(controls, 'Go');
}

function update() {
    let nbrBursts = controls.nbrBursts;
    let mjrRadius = controls.mjrRadius;
    let mnrRadius = controls.mnrRadius;
    let burstRadius = controls.burstRadius;
    let maxRays = controls.maxRays;
    if (root)
        scene.remove(root);
    root = makeTorus(nbrBursts, mjrRadius, mnrRadius, maxRays, burstRadius);
    scene.add(root);
}



function render() {
    let delta = clock.getDelta();
    cameraControls.update(delta);
    renderer.render(scene, camera);
}


function init() {
	let canvasWidth = window.innerWidth;
	let canvasHeight = window.innerHeight;
	let canvasRatio = canvasWidth / canvasHeight;

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({antialias : true, preserveDrawingBuffer: true});
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColor(0x000000, 1.0);

	camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 1000);
	camera.position.set(0, 0, 30);
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
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
createSceneA();
initGui();
addToDOM();
animate();
