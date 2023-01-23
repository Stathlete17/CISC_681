/***********
 * triangle015.js
 * A square with orbit control
 * M. Laszlo
 * September 2019
 ***********/

let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();


function createScene() {
    let triangle = createPyramid();
    let axes = new THREE.AxesHelper(10);
    scene.add(triangle);
    scene.add(axes);
}


function makeSquare() {
    let geom = new THREE.Geometry();

    let inc = 2 * Math.PI / 4;
    let a = new THREE.Vector3(3.53 * Math.cos(0),3.53 * Math.sin(0),0 );
    let b = new THREE.Vector3(3.53 * Math.cos(0+inc),3.53 * Math.sin(0+inc),0 );
    let c = new THREE.Vector3(3.53 * Math.cos(0+inc+inc),3.53 * Math.sin(0+inc+inc),0 );
    let d = new THREE.Vector3(3.53 * Math.cos(0+inc+inc+inc),3.53 * Math.sin(0+inc+inc+inc),0);
    geom.vertices.push(a, b, c, d);
    let face1 = new THREE.Face3(0, 1, 2);
    let face2 = new THREE.Face3(2, 1, 3);
    geom.faces.push(face1, face2);
    let args = {color: 0xFF00FF, side: THREE.DoubleSide};
    let mat = new THREE.MeshBasicMaterial(args);
    let mesh = new THREE.Mesh(geom, mat);
    return mesh;
}




function createPyramid(n, rad, len) {
    let len2 = len / 2;  // half the pyramid's height
    let geom = new THREE.Geometry();
    // push n + 1 vertices
    //  first the apex...
    geom.vertices.push(new THREE.Vector3(0, len2, 0));
    //  ... and then the n vertices of the base
    let inc = 2 * Math.PI / n;
    for (let i = 0, a = 0; i < n; i++, a += inc) {
        let cos = Math.cos(a);
        let sin = Math.sin(a);
        geom.vertices.push(new THREE.Vector3(rad*cos, -len2, rad*sin));
    }
    // push the n triangular faces...
    for (let i = 1; i < n; i++) {
        let face = new THREE.Face3(i+1, i, 0);
        geom.faces.push(face);
    }
    let face = new THREE.Face3(1, n, 0);
    geom.faces.push(face);

    for (let i = 2; i < n; i++) {
        let face = new THREE.Face3(i, i+1, 1);
        geom.faces.push(face);
    }

    // set face normals and return the geometry
    geom.computeFaceNormals();
    return geom;
}


function animate() {
	window.requestAnimationFrame(animate);
	render();
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
createScene();
addToDOM();
render();
animate();

