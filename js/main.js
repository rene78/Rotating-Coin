
const swissFranc = three();

function three() {
  let scene, camera, renderer, coin, id, angleToVertical;
  initializeScene();

  // Adding ambient lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  // Left point light
  const pointLightLeft = new THREE.PointLight(0xff4422, 1);
  pointLightLeft.position.set(-1, -1, 3);
  scene.add(pointLightLeft);

  // Right point light
  const pointLightRight = new THREE.PointLight(0x44ff88, 1);
  pointLightRight.position.set(1, 2, 3);
  scene.add(pointLightRight);

  // Top point light
  const pointLightTop = new THREE.PointLight(0xdd3311, 1);
  pointLightTop.position.set(0, 3, 2);
  scene.add(pointLightTop);

  THREE.ImageUtils.crossOrigin = '';
  // IMPORTANT: This next line defines the texture of your coin. I didn't include the Minecraft texture (for copyright reasons) You should replace the url inside '.load(...)' with the path to your own image.
  const textureCirc = new THREE.TextureLoader().load("img/circumference.jpg");
  textureCirc.wrapS = THREE.RepeatWrapping;//repeat texture horizontally
  textureCirc.repeat.set(20, 0);//repeat 20x
  const textureHeads = new THREE.TextureLoader().load("img/heads.jpg");
  const textureTails = new THREE.TextureLoader().load("img/tails.jpg");
  const metalness = 0.7;
  const roughness = 0.3;

  const materials = [
    new THREE.MeshStandardMaterial({
      //Circumference
      map: textureCirc,
      metalness: metalness,
      roughness: roughness
    }),
    //1st side
    new THREE.MeshStandardMaterial({
      map: textureHeads,
      metalness: metalness,
      roughness: roughness
    }),
    //2nd side
    new THREE.MeshStandardMaterial({
      map: textureTails,
      metalness: metalness,
      roughness: roughness
    })
  ];

  var geometry = new THREE.CylinderGeometry(3, 3, 0.4, 100);
  coin = new THREE.Mesh(geometry, materials);

  scene.add(coin);
  camera.position.set(0, 0, 7);

  coin.rotation.x = Math.PI / 2;
  coin.rotation.y = Math.PI / 2;

  animateCoin();

  //Update canvas on container size change. Thanks to gman (https://stackoverflow.com/a/45046955/5263954)!
  function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      console.log("Container size of coin animation has changed. Canvas size updated!");
      // you must pass false here or three.js sadly fights the browser
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // set render target sizes here
    }
  }

  function animateCoin(time) {
    time *= 0.001;  // seconds, not used
    // console.log(time);

    resizeCanvasToDisplaySize();

    coin.rotation.x += 0.05;

    renderer.render(scene, camera);
    id = requestAnimationFrame(animateCoin);
  }

  function initializeScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector(".three-coin canvas") });
    scene.background = new THREE.Color(0xffffff);
  }

  function stopAnimation(side) {
    //on first run of function "side" is a string ("heads" or "tails"). On subsequent runs it is a timestamp (number)
    if (typeof side === "string") {
      // console.log(side);
      angleToVertical = (side === "tails") ? (3 * Math.PI / 2) : (Math.PI / 2);//tails=1.5pi, heads=pi/2
      // console.log(angleToVertical);
    }

    let rotVal = coin.rotation.x;

    // console.log(rotVal);
    let deltaAngle = rotVal % (Math.PI * 2) - angleToVertical;
    // console.log(deltaAngle);

    if (deltaAngle < 0.06 && deltaAngle > -0.06) {
      cancelAnimationFrame(id);//cancel coin animation
      cancelAnimationFrame(stopAnimation);//cancel excution of this function
      //show start button
      document.querySelector(".start-button").className="";
      return;
    }
    requestAnimationFrame(stopAnimation);//rerun this function until if-statment above is true
  }

  const coinObj = {
    stopAnimation,
    animateCoin
  }
  return coinObj;
}