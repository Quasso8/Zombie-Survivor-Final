import { damageZombie } from './zombies.js';

let bullets = [];

const MAX_BULLETS = 40;

export function shoot(scene, player, offset = 0){

 let b = new THREE.Mesh(
 new THREE.SphereGeometry(0.15, 4, 4),
  new THREE.MeshBasicMaterial({
 color: 0xffcc00
})
 );

b.position.copy(player.position);
b.position.x += offset;
 b.position.z -= 1;

 scene.add(b);


b.trail = null;



bullets.push(b);
}

export function updateBullets(scene, zombies, delta){

 for(let i = bullets.length - 1; i >= 0; i--){

  let b = bullets[i];

  b.position.z -= 0.7 * delta;
  //if(b.trail){
//b.trail.position.lerp(b.position, 0.3);
// b.trail.position.z += 0.3;

  if(b.position.z < -45){
  scene.remove(b);
  if(b.trail) scene.remove(b.trail);
  bullets.splice(i,1);
// }
}

  // 💥 HIT CHECK
  for(let j = zombies.length - 1; j >= 0; j--){

   let z = zombies[j];

   if(z.dead) continue;

   let dx = b.position.x - z.position.x;
   let dz = b.position.z - z.position.z;

   let dist = Math.sqrt(dx*dx + dz*dz);

   if(dist < 1){

    damageZombie(scene, j);

    scene.remove(b);
if(b.trail){
 scene.remove(b.trail);
}
    bullets.splice(i,1);
    break;
   }
  }

  if(bullets[i] && b.position.z < -50){
   scene.remove(b);
   bullets.splice(i,1);
  }
 }
}