let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let cantor;
let len = 1;
let mat;



function createScene() {
    let nbrLevels = controls.nbrLevels;
    let color = new THREE.Color(controls.color);
    let opacity = controls.opacity;
    let matArgs = {color: color, transparent: true, opacity: opacity};
    mat = new THREE.MeshLambertMaterial(matArgs);
    cantor = makeCantor3(retainSierpinskiTetrahedron, nbrLevels, mat, len);
    let light = new THREE.PointLight(0xFFFFFF, 1.0, 1000 );
    light.position.set(0, 0, 40);
    let light2 = new THREE.PointLight(0xFFFFFF, 0.4, 1000 );
    light2.position.set(20, 40, -20);
    let ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(light);
    scene.add(light2);
    scene.add(ambientLight);
    scene.add(cantor);
}


function makeCantor3(retainF, level, mat, len=1) {
    if (level == 0) {
        let geom = new THREE.TetrahedronGeometry(len, 0);
        return new THREE.Mesh(geom, mat);
    }
    else {
        let cantor = makeCantor3(retainF, level-1, mat, len);
        let root = new THREE.Object3D();
        root.scale.set(1/3, 1/3, 1/3);
        for (x of [-len, 0, len]) {
            for (y of [-len, 0, len]) {
                for (z of [-len, 0, len]) {
                    if (retainF(x, y, z, len)) {
                        let clone = cantor.clone();
                        clone.position.set(x, y, z);
                        root.add(clone);
                    }
                }
            }
        }
        return root;
    }
}


function retainSierpinskiTetrahedron(x, y, z, len) {
    return (Math.abs(x) + Math.abs(y) + Math.abs(z)) > len;
}

function retainMoselySnowflake(x, y, z, len) {
    return (Math.abs(x) + Math.abs(y) + Math.abs(z)) < 3 * len;
}

function retainMoselySnowflakeLight(x, y, z, len) {
    let val = Math.abs(x) + Math.abs(y) + Math.abs(z);
    return (val < 3 * len) && (val > 0);
}


function retainSMSnowflakeAlt(x, y, z, len) {
    let val = Math.abs(x) + Math.abs(y) + Math.abs(z);
    return (Math.abs(x) + Math.abs(y) + Math.abs(z)) == 2 * len;
}



var controls = new function() {
    this.nbrLevels = 1;
    this.opacity = 1.0;
    this.color = '#e81484';
    this.type = 'Sierpinski Tetrahedron';
}

function initGui() {
    var gui = new dat.GUI();
    gui.add(controls, 'nbrLevels', 0, 4).step(1).onChange(update);
//    gui.add(controls, 'opacity', 0.1, 1.0).step(0.1);
    gui.addColor(controls, 'color');
    let objectTypes = ['Sierpinski Tetrahedron', 'Mosely Snowflake', 'Light Mosely Snowflake'];
    gui.add(controls, 'type', objectTypes).onChange(update);
}

function update() {
    if (cantor)
        scene.remove(cantor);
    let f = null;
    switch (controls.type) {
        case 'Sierpinski Tetrahedron':
            f = retainSierpinskiTetrahedron;
            break;
        case 'Mosely Snowflake':
            f = retainMoselySnowflake;
            break;
        case 'Light Mosely Snowflake':
            f = retainMoselySnowflakeLight;
            break;
    }
    cantor = makeCantor3(f, controls.nbrLevels, mat, len);    
    scene.add(cantor);
}



function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);
    mat.color = new THREE.Color(controls.color);
    mat.opacity = controls.opacity;
    renderer.render(scene, camera);
}



function init() {
	var canvasWidth = window.innerWidth;
	var canvasHeight = window.innerHeight;
	var canvasRatio = canvasWidth / canvasHeight;

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
    camera.position.set(0, 2, 3);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
}


function addToDOM() {
	var container = document.getElementById('container');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}



init();
createScene();
initGui();
addToDOM();


