const geo = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 16);
const mat = new THREE.MeshStandardMaterial({
 color: 0xffd700,
 metalness: 0.1,
 roughness: 0.3
});

let coins = [];
const MAX_COINS = 50;

export function spawnCoin(scene, position, amount = 1){

 if(coins.length > MAX_COINS) return;

 for(let i = 0; i < amount; i++){

 let c = new THREE.Mesh(geo, mat);

  c.position.copy(position);
  c.position.x += (Math.random() - 0.5) * 0.5;

  coins.push(c);
  scene.add(c);
 }
}

export function updateCoins(scene, player, onCollect, delta){

 for(let i = coins.length - 1; i >= 0; i--){

  let c = coins[i];

  c.rotation.y += 4 * delta;

  let dx = player.position.x - c.position.x;
  let dz = player.position.z - c.position.z;

  let dist = Math.sqrt(dx*dx + dz*dz);

if(dist < 1.5){

    scene.remove(c);
 coins.splice(i, 1);

 onCollect(1);
    

 let strength = (1 - dist / 6);

 // ❗ verhindern dass durch 0 geteilt wird
 let safeDist = Math.max(dist, 0.001);

 dx /= safeDist;
 dz /= safeDist;

 // 🔥 stärker & flüssiger Magnet
 let speed = 4; // <- wichtig!

 c.position.x += dx * speed * strength * delta;
 c.position.z += dz * speed * strength * delta;
}
 

  // Einsammeln
  if(dist < 45){

 let safeDist = Math.max(dist, 0.001);

 dx /= safeDist;
 dz /= safeDist;

 // 🔥 Stärke abhängig von Entfernung
 let strength = 1 - (dist / 45);

 // 🟡 langsam weit weg, 🟢 schnell nah dran
 let speed = 0.1 + strength * 0.2;

 c.position.x += dx * speed * delta;
 c.position.z += dz * speed * delta;
}

  if(c.position.z > 10){
   scene.remove(c);
   coins.splice(i,1);
  }
 }
}