
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

  function animateCoin() {
    coin.rotation.x += 0.05;
    xRotAngle = coin.rotation.x;
    id = requestAnimationFrame(animateCoin);
    // console.log(id);
    // console.log(xRotAngle);

    //Change camera position during animation
    // let dist = 7;
    // dist = dist + (dist * id / 1000);
    // console.log(dist);
    // camera.position.set(0, 0, dist);

    renderer.render(scene, camera);
  }

  function initializeScene() {
    let div = document.querySelector(".three-coin");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, div.offsetWidth / div.offsetHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(div.offsetWidth, div.offsetHeight);
    div.appendChild(renderer.domElement);
    // document.body.appendChild(renderer.domElement);
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

/*
function startAnimation() {
  //Replace current three.js canvas ("three-coin") with an empty one. Else a new one is created
  // let newdiv = document.createElement("div");
  // newdiv.setAttribute("class", "three-coin");
  // let oldDiv = document.querySelector(".three-coin");
  // let mainBody = document.querySelector("main");
  // mainBody.replaceChild(newdiv, oldDiv);
  // three();
  animateCoin();
}
*/