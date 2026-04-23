import { spawnCoin } from "./coins.js";
let zombies = [];
let difficulty = 1;

export function spawnZombie(scene){


 let type = Math.random();

 let z = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshStandardMaterial({color:0x00ff00})
 );

 z.position.set((Math.random()-0.5)*10, 0.5, -30);

 // 👉 TYPES
 if(type < 0.6){
  // NORMAL
  z.hp = 3;
  z.maxHp = 3;
  z.speed = 0.1;
  z.material.color.set(0x00ff00);
 }

 else if(type < 0.85){
  // FAST
  z.hp = 2;
  z.maxHp = 2;
  z.speed = 0.2;
  z.scale.set(0.7,0.7,0.7);
  z.material.color.set(0xffff00);
 }

 else{
  // TANK
  z.hp = 8;
  z.maxHp = 8;
  z.speed = 0.05;
  z.scale.set(1.5,1.5,1.5);
  z.material.color.set(0x00ff00); // ✅ STARTET GRÜN
}

 scene.add(z);
 zombies.push(z);
}

export function updateZombies(scene, player, onHit, delta){

 for(let i = zombies.length - 1; i >= 0; i--){

  let z = zombies[i];

  // 👉 Tote Zombies ignorieren
  if(z.dead) continue;

  // 👉 Richtung Spieler berechnen
  let dx = player.position.x - z.position.x;
  let dz = player.position.z - z.position.z;

  let dist = Math.sqrt(dx*dx + dz*dz);

  // 👉 Treffer auf Spieler
  if(dist < 1.5){

   if(onHit) onHit();

   z.dead = true;
   z.visible = false;

   continue;
  }

  // 👉 Bewegung
  if(dist > 0.01){
   dx /= dist;
   dz /= dist;

   z.position.x += dx * z.speed * delta;
   z.position.z += dz * z.speed * delta;
  }
 }

 // 👉 Cleanup (WICHTIG – AUSSERHALB der Schleife!)
 for(let i = zombies.length - 1; i >= 0; i--){
  if(zombies[i].dead){
   scene.remove(zombies[i]);
   zombies.splice(i,1);
  }
 }
}

 

export function getZombies(){
 return zombies;
}

export function damageZombie(scene, index){

 let z = zombies[index];

 z.hp--;

 let ratio = z.hp / z.maxHp;
 z.material.color.setRGB(1, ratio, 0);

 if(z.hp <= 0){

  // 👉 COIN DROP (JE NACH TYP)
  let amount = 1;

  if(z.scale.x > 1.2){
    // TANK
    amount = 5;
  } else if(z.scale.x < 1){
    // FAST
    amount = 2;
  } else {
    // NORMAL
    amount = 3;
  }

  spawnCoin(scene, z.position, amount);

  z.visible = false;
  z.dead = true;
}
}