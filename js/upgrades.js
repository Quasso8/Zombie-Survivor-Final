let gates = [];

export function spawnGates(scene){

 let left = createGate(scene, -3);
 let right = createGate(scene, 3);

 gates.push(left);
 gates.push(right);
}

function createGate(scene, x){

 let g = new THREE.Mesh(
  new THREE.BoxGeometry(2,2,0.5),
  new THREE.MeshBasicMaterial({
 color: 0x00ff88,
 transparent: true,
 opacity: 0.7
})
 );

 g.position.set(x,1,-30);

 // 👉 1. TYPE setzen (WICHTIG!)
 let types = ["+Speed", "+Bullets"];
 g.type = types[Math.floor(Math.random()*types.length)];

 // 👉 2. LABEL erstellen
 let label = document.createElement("div");
 label.innerText = g.type;
 label.style.position = "absolute";
 label.style.color = "white";
 label.style.fontWeight = "bold";
 label.style.pointerEvents = "none";
 label.style.transform = "translate(-50%, -50%)";

 document.body.appendChild(label);

 g.label = label;

 scene.add(g);

 // 👇 Glow Halo (sehr billig für Performance)
let glow = new THREE.Mesh(
 new THREE.PlaneGeometry(3, 3),
 new THREE.MeshBasicMaterial({
  color: 0x00ff88,
  transparent: true,
  opacity: 0.15
 })
);

glow.position.copy(g.position);
glow.position.z += 0.1;

scene.add(glow);

g.glow = glow;

 return g;
}

export function updateGates(scene, player, applyUpgrade, delta){

 for(let i = gates.length - 1; i >= 0; i--){

  let g = gates[i];

  // 👉 prüfen ob Spieler näher an diesem Gate ist
let distanceX = Math.abs(player.position.x - g.position.x);

// 👉 Highlight wenn nah dran
if(distanceX < 1.5){

 g.scale.set(1.3, 1.3, 1.3);

 if(g.glow){
  g.glow.scale.set(1.5,1.5,1.5);
  g.glow.material.opacity = 0.3;
 }

}else{

 g.scale.set(1,1,1);

 if(g.glow){
  g.glow.scale.set(1,1,1);
  g.glow.material.opacity = 0.15;
 }
}

  // 👉 Bewegung
  g.position.z += 0.2 * delta;

  if(g.glow){
 g.glow.position.copy(g.position);
 g.glow.position.z += 0.1;
}

 let vector = g.position.clone();
vector.y += 1; // 👈 TEXT etwas über das Gate
vector.project(window.camera);

let x = (vector.x * 0.5 + 0.5) * window.innerWidth;
let y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

g.label.style.left = x + "px";
g.label.style.top = y + "px";

 


  // 👉 Collision mit Spieler
  let dx = player.position.x - g.position.x;
  let dz = player.position.z - g.position.z;

  let dist = Math.sqrt(dx*dx + dz*dz);

  if(dist < 1.5){

   applyUpgrade(g.type);

   // 👉 ALLE Gates löschen
  gates.forEach(g2 => {
 scene.remove(g2);
if(g2.glow) scene.remove(g2.glow);
 document.body.removeChild(g2.label); // 👈 DAS FEHLT BEI DIR
});
   gates = [];
   return;
  }

  // 👉 entfernen wenn vorbei
 if(g.position.z > 10){
 scene.remove(g);
if(g.glow) scene.remove(g.glow);
 document.body.removeChild(g.label); // 👈 WICHTIG
 gates.splice(i, 1);
}
 }
}