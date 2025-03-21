
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

window.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

const lines = [
  "benfly.netlify.app",
  "is not a landing page",
  "is not a portfolio",
  "is not a blog",
  "it is a playground"
];

const el = document.getElementById("typewriter");
let i = 0;

function typeLine() {
  if (i >= lines.length) {
    setTimeout(() => {
      document.getElementById("typewriter").style.display = "none";
      document.getElementById("three-container").style.display = "block";
      initThree();
    }, 1000);
    return;
  }
  let j = 0;
  let line = lines[i];
  let typing = setInterval(() => {
    el.textContent += line[j];
    j++;
    if (j === line.length) {
      clearInterval(typing);
      el.textContent += "\n";
      i++;
      setTimeout(typeLine, 600);
    }
  }, 50);
}

typeLine();

function initThree() {
  const container = document.getElementById("three-container");

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x00111a);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, -5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x333333, 1);
  scene.add(light);

  const planeGeometry = new THREE.ConeGeometry(0.5, 2, 3);
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xff5555 });
  const airplane = new THREE.Mesh(planeGeometry, planeMaterial);
  airplane.rotation.z = Math.PI;
  scene.add(airplane);

  let velocity = 0.05;

  function animate() {
    requestAnimationFrame(animate);

    if (keys.ArrowLeft) airplane.rotation.y += 0.02;
    if (keys.ArrowRight) airplane.rotation.y -= 0.02;
    if (keys.ArrowUp) airplane.rotation.x += 0.02;
    if (keys.ArrowDown) airplane.rotation.x -= 0.02;

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(airplane.quaternion);
    airplane.position.addScaledVector(forward, velocity);

    const camOffset = new THREE.Vector3(0, 2, -6).applyQuaternion(airplane.quaternion);
    const desiredCamPos = airplane.position.clone().add(camOffset);
    camera.position.lerp(desiredCamPos, 0.05);
    camera.lookAt(airplane.position);

    renderer.render(scene, camera);
  }

  animate();
}
