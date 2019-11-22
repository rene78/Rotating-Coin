let scene, camera, renderer, id;
let coin;

document.addEventListener("DOMContentLoaded", three);

function three() {
  initializeScene()

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
  const textureCirc = new THREE.TextureLoader().load("circumference1.jpg");
  textureCirc.wrapS = THREE.RepeatWrapping;//repeat texture horizontally
  textureCirc.repeat.set(20, 0);//repeat 20x
  const textureHeads = new THREE.TextureLoader().load("heads.jpg");
  const textureTails = new THREE.TextureLoader().load("tails.jpg");
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

  animate();

  setTimeout(function () { console.log(coin.rotation.x); }, 2000);
  // setTimeout(function () { cancelAnimationFrame( id ); }, 1000);
}

function animate() {
  coin.rotation.x += 0.1;
  xRotAngle = coin.rotation.x;
  id = requestAnimationFrame(animate);
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

const side = "tails";
function stopAnimation() {
  let rotVal = coin.rotation.x;
  const headsAngle = (2.5 * Math.PI);//7.85 -->falsch!
  const tailsAngle = (3.5 * Math.PI);//11.00

  // const stopAngle = (side === "tails") ? tailsAngle : headsAngle;
  // console.log(stopAngle);

  console.log(rotVal);
  // console.log("Heads Angle: " + headsAngle);
  // console.log("(rotVal % headsAngle): " + rotVal % headsAngle);
  let leftover = rotVal % (Math.PI * 2) - (Math.PI / 2);
  console.log(leftover);

  if (leftover < 0.06 && leftover > -0.06) {
    cancelAnimationFrame(id);//cancel coin animation
    cancelAnimationFrame(stopAnimation);//cancel excution of this function
    return;
  }
  requestAnimationFrame(stopAnimation);//rerun this function until if-statment below is true
}

function startAnimation() {
  //Replace current three.js canvas ("three-coin") with an empty one. Else new one is created
  var newdiv = document.createElement("div");
  newdiv.setAttribute("class", "three-coin");
  var oldDiv = document.querySelector(".three-coin");
  var mainBody = document.querySelector("main");
  mainBody.replaceChild(newdiv, oldDiv);
  three();
}

//Weiteres Vorgehen
// 1. Münze nur in Teilbereich der Website darstellen
// 2. Knopf erzeugen. Nach Druck soll Animation bei Kopf bzw. Zahl stoppen
//in radian
//heads=1.57 und vielfache von 2pi --> pi/2 (1.57), 2.5pi (7.85), 4.5pi (14.14)
//tails=3.14+1.57