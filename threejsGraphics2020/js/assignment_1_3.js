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
    let cylinder = regularPolygonGeometry(8, "red","blue");
    let axes = new THREE.AxesHelper(10);
    scene.add(cylinder);
    scene.add(axes);
}

function regularPolygonGeometry(n, innerColor, outerColor) {
    var geometry = new THREE.Geometry();

    // Create vertices of the polygon
    for (var i = 0; i < n; i++) {
        var angle = (2 * Math.PI * i) / n;
        var x = 2 * Math.cos(angle);
        var y = 2 * Math.sin(angle);
        geometry.vertices.push(new THREE.Vector3(x, y, 0));
    }

    // Create faces of the polygon
    for (var i = 0; i < n - 2; i++) {
        geometry.faces.push(new THREE.Face3(0, i + 1, i + 2));
    }

    return geometry;
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