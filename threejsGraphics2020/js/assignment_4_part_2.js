let camera, scene, renderer;
let cameraControls;
let clock = new THREE.Clock();
let pyramid;
let cyl ;


function createScene() {
    ring = makeRing(10,2.5,14, 5);
	let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
	light.position.set(0, 0, 10);
    let ambientLight = new THREE.AmbientLight(0x222222);
	scene.add(light);
	scene.add(ambientLight);
	scene.add(ring);

}


function makeRing(majorRad,minorRad,nbrToruses,cherry,materials) {
    let ypos = cherry ;
    let sf = .01;
    if (!materials) mats = [];
    root = new THREE.Object3D();
    for (let i = 0; i <= nbrToruses; i++) {
        let geom = new THREE.TorusGeometry(majorRad, minorRad/i*2,  150, 20);
        let mat;
        if (!materials) {
            let matArgs = { color: getRandomColor()};
            mat = new THREE.MeshLambertMaterial(matArgs);
            mats.push(mat);
        } else {
            mat = mats[i];
        }

        cyl = new THREE.Mesh(geom, mat);
        cyl.position.y = ypos;
        cyl.scale.set(sf, sf, sf);
		cyl.rotateX(190);
        root.add(cyl);
        ypos = ypos;
        sf = sf+0.1;
		root.rps = .06;
		cyl.rps = 50;

		if(i==nbrToruses){
		let geometry = new THREE.SphereGeometry( minorRad*2/i*1.5 );
		let gem = new THREE.Mesh(geometry, mat);
		gem.position.y = cherry;
		root.add(gem);
		}
    }


	 return root;

}


function update() {
    let delta = clock.getDelta();
    let deltaRadians = rpsToRadians(root.rps, delta);
    root.rotation.z += deltaRadians;
    root.rotation.y %= 2 * Math.PI;

	for (let i = 0; i <= 14; i++){
	let delta2 = clock.getDelta();
    let deltaRadians2 = rpsToRadians(root.children[i].rps, delta2);
    root.children[i].rotation.x += deltaRadians2;
    root.children[i].rotation.z %= 2 * Math.PI;

	root.position.y = root.position.y-.2;
	root.position.y = root.position.y+.2;
	}

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
	renderer.setClearColor(0x0, 1.0);
    renderer.setAnimationLoop(function () {
       update();
        renderer.render(scene, camera);
    });

	camera = new THREE.PerspectiveCamera(40, canvasWidth/canvasHeight, 1, 1000);
	camera.position.set(50, 20, 20);
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

