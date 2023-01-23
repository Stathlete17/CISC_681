let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();




function createScene() {
	let pyramid = makePyramid(20,18,.4);
	scene.add(pyramid);

}


function makePyramid(tori,mjrRadius,mnrRadius){
    let root = new THREE.Object3D();
    let t = -5;
    for (let i = tori-1; i < tori && i >=0; i--) {
            let y = t;
            let torus = makeTorus(mjrRadius,mnrRadius);
            torus.position.set(0,t,0);
            torus.rotateX(190);
            root.add(torus);
            t = t+.7;
            mjrRadius = mjrRadius-1;
            mnrRadius = mnrRadius+.5/mjrRadius;

            if( i == 0){
                let sphereColor = getRandomColor(.7,.2,.4)
                let geometry = new THREE.SphereGeometry( mjrRadius );
                let mat = new THREE.MeshBasicMaterial({ color: sphereColor});
                let mesh = new THREE.Mesh(geometry, mat);
                mesh.position.set(0,t+.5,0);
                scene.add(mesh);
	            }
	        }
    return root;
}

function makeTorus(mjrRadius,mnrRadius){
    let geom = new THREE.TorusGeometry(mjrRadius, mnrRadius, 150, 20);
    let innerColor = getRandomColor(.4, .7, .2);
    let mat = new THREE.MeshBasicMaterial({color: innerColor});
    let mesh = new THREE.Mesh(geom, mat);
    return mesh;
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