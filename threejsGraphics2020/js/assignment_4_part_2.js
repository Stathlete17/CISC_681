let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();




function createScene() {
	let helix = makeHelix(49,2,Math.PI /4,0.5);
	scene.add(helix);
    let axes = new THREE.AxesHelper(10);
    scene.add(axes);
    let light = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light.position.set(0, 0, 40);
    let light2 = new THREE.PointLight(0xFFFFFF, 0.4, 1000 );
    light2.position.set(20, 40, -20);
    let ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(light);
    scene.add(light2);
    scene.add(ambientLight);
}

function makeHelix(n, radius, angle, dist){
    let mat = new THREE.MeshLambertMaterial({color: 'blue'});
    let geom = new THREE.SphereGeometry(1, 12, 12);
    let mesh = new THREE.Mesh(geom, mat);
    let helix = createHelix(mesh, n, radius, angle, dist);

    return helix;
}

function createHelix(object, n, radius, angle, dist) {
   let group = new THREE.Object3D();

   for (var i = 0; i < n; i++) {
       let clone = object.clone();
       x = radius * Math.cos(angle * i);
       y = radius * Math.sin(angle * i);
       z = dist * i;
       clone.position.set(x,y,z);
       group.add(clone);
   }
   return group;
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

	camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 100);
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