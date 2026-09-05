import * as THREE from "three";

// A single Timer drives the scene; R3F 9 currently constructs deprecated Clock internally.
export function createScene(container: HTMLDivElement) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 6.5;
  const timer = new THREE.Timer();
  timer.connect(document);
  const group = new THREE.Group();
  scene.add(group, new THREE.AmbientLight(0xffffff, 0.55));
  const directional = new THREE.DirectionalLight("#e9eee7", 4);
  directional.position.set(2, 4, 5);
  scene.add(directional);
  for (const [color, intensity, x, y, z] of [
    ["#ff673d", 16, -3, -1, 2],
    ["#b4c7d1", 8, 3, 2, -1],
    ["#efad77", 3.5, 0, 0, 0],
  ] as const) {
    const light = new THREE.PointLight(color, intensity, 10);
    light.position.set(x, y, z);
    scene.add(light);
  }
  const outer = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 4),
    new THREE.MeshPhysicalMaterial({
      color: "#535957",
      roughness: 0.24,
      metalness: 0.5,
      clearcoat: 1,
      clearcoatRoughness: 0.16,
      transmission: 0.18,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
    }),
  );
  outer.scale.setScalar(1.12);
  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 3),
    new THREE.MeshPhysicalMaterial({
      color: "#eedbc3",
      emissive: "#c56031",
      emissiveIntensity: 1.8,
      roughness: 0.08,
      metalness: 0.35,
      clearcoat: 1,
    }),
  );
  inner.scale.setScalar(0.5);
  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 2),
    new THREE.MeshBasicMaterial({
      color: "#d0dbd4",
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    }),
  );
  wire.scale.setScalar(1.28);
  group.add(outer, inner, wire);
  const orbits = [
    [1.72, Math.PI / 2.5, 0.2, 0, 0.25],
    [1.95, 1.1, 0.4, 0, 0.15],
    [2.2, 0.4, 1.2, 0.3, 0.1],
  ].map(([radius, x, y, z, opacity]) => {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.004, 8, 160),
      new THREE.MeshBasicMaterial({
        color: "#9cc5ff",
        transparent: true,
        opacity,
      }),
    );
    mesh.rotation.set(x, y, z);
    group.add(mesh);
    return mesh;
  });
  const nodes = Array.from({ length: 18 }, (_, index) => {
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.012 + (index % 4) * 0.006, 8, 8),
      new THREE.MeshBasicMaterial({ color: "#d8eaff" }),
    );
    group.add(node);
    return node;
  });
  const positions = new Float32Array(1800 * 3);
  const random = (seed: number) => {
    const n = Math.sin(seed * 12.9898) * 43758.5453;
    return n - Math.floor(n);
  };
  for (let i = 0; i < 1800; i++) {
    const radius = 2.2 + random(i + 1) * 4.5,
      theta = random(i + 10001) * Math.PI * 2,
      phi = Math.acos(2 * random(i + 20001) - 1);
    positions.set(
      [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      ],
      i * 3,
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: "#8fbaff",
      size: 0.012,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(particles);
  const pointer = new THREE.Vector2();
  const move = (event: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      1 - ((event.clientY - rect.top) / rect.height) * 2,
    );
  };
  const resize = new ResizeObserver(() => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  resize.observe(container);
  container.addEventListener("pointermove", move);
  let inView = true;
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
  });
  observer.observe(container);
  let elapsed = 0;
  renderer.setAnimationLoop((timestamp) => {
    timer.update(timestamp);
    if (!inView || document.hidden) return;
    const delta = Math.min(timer.getDelta(), 0.05);
    elapsed += delta;
    group.rotation.set(0.12 + pointer.y * 0.12, pointer.x * 0.16, -0.15);
    group.position.y = Math.sin(elapsed * 0.8) * 0.04;
    outer.rotation.x += delta * 0.08;
    outer.rotation.y += delta * 0.13;
    inner.rotation.x -= delta * 0.16;
    inner.rotation.y += delta * 0.24;
    inner.scale.setScalar(0.5 + Math.sin(elapsed * 1.8) * 0.018);
    wire.rotation.x -= delta * 0.06;
    wire.rotation.y -= delta * 0.1;
    orbits.forEach((orbit, index) => {
      orbit.rotation.z += delta * [0.08, -0.045, 0.025][index];
    });
    nodes.forEach((node, index) => {
      const angle =
          (index / 18) * Math.PI * 2 +
          elapsed * (0.8 + (index % 5) * 0.12) * 0.035,
        radius = 1.65 + Math.sin(index * 2.1) * 0.12;
      node.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.7) * 0.3,
        Math.sin(angle) * radius,
      );
    });
    particles.rotation.y += delta * 0.012;
    renderer.render(scene, camera);
  });
  return () => {
    renderer.setAnimationLoop(null);
    timer.dispose();
    resize.disconnect();
    observer.disconnect();
    container.removeEventListener("pointermove", move);
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((material) => material.dispose());
      }
    });
    renderer.dispose();
    renderer.domElement.remove();
  };
}
