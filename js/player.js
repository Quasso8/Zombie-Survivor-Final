let player;
let targetX = 0;

export function createPlayer(scene){

 player = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshStandardMaterial({color:0x0077ff})
 );

 player.position.set(0,0.5,5);

 scene.add(player);
}

let lastTouchX = null;

export function setupControls(){

 // 👉 Maus
 window.addEventListener("mousemove", (e)=>{
  let x = (e.clientX / window.innerWidth - 0.5) * 10;
  targetX = x;
 });

 // 👉 Touch START
 window.addEventListener("touchstart", (e)=>{
  lastTouchX = e.touches[0].clientX;
 });

 // 👉 Touch MOVE
 window.addEventListener("touchmove", (e)=>{

  let touch = e.touches[0];
  let currentX = touch.clientX;

  if(lastTouchX !== null){
   let delta = currentX - lastTouchX;
   targetX += delta * 0.02;
  }

  lastTouchX = currentX;
 });

 // 👉 Touch END
 window.addEventListener("touchend", ()=>{
  lastTouchX = null;
 });
}


export function updatePlayer(){

 // 👉 smooth movement
 player.position.x += (targetX - player.position.x) * 0.2;
 targetX = Math.max(-5, Math.min(5, targetX));
}

export function getPlayer(){
 return player;
}