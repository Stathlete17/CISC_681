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
    let regularPolygon = regularPolygonGeometry(5, 5, 0xff00ff,0x00ff00);
    let axes = new THREE.AxesHelper(10);
    scene.add(regularPolygon);
    scene.add(axes);
}

function regularPolygonGeometry(n,rad, innercolor, outercolor){
    let geom = new THREE.Geometry();
    let inc = 2 * Math.PI / n;
    let insideColor = new THREE.Color(innercolor);
    let outsideColor = new THREE.Color(outercolor);
  // trying to make the vertices
  for (let i = 0, a =0; i <= n; i++, a+= inc) {
        let cos = Math.cos(a);
        let sin = Math.sin(a);
        geom.vertices.push(new THREE.Vector3(rad*cos, rad*sin,0));
        geom.colors.push(insideColor, outsideColor);
    }

  for (let i = 0; i < n-1; i++) {
        geom.faces.push(new THREE.Face3(0, i, i+1));
  }

  let args = {vertexColors: true, side: THREE.DoubleSide};
  let mat = new THREE.MeshBasicMaterial(args);
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