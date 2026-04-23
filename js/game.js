import { createPlayer, updatePlayer, setupControls } from './player.js';
import { shoot, updateBullets } from './bullets.js';
import { getPlayer } from './player.js';
import { spawnZombie, updateZombies, getZombies } from './zombies.js';
import { spawnGates, updateGates } from './upgrades.js';
import { updateCoins } from "./coins.js";
let fireRate = 300;
let bulletCount = 1;

let scene, camera, renderer;
let hp = 100;
let coinCount = 0;

export function initGame(){

 scene = new THREE.Scene();

 camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
 window.camera = camera;
camera.position.set(0, 10, 15);
camera.lookAt(0, 0, -15);

 renderer = new THREE.WebGLRenderer({antialias:false}); // ❌ Antialias AUS
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 👈 WICHTIG
 renderer.setSize(window.innerWidth, window.innerHeight);
 renderer.setClearColor(0x222222);
 document.body.appendChild(renderer.domElement);

 let light = new THREE.DirectionalLight(0xffffff, 1);
 light.position.set(5,10,5);
 scene.add(light);

 let ambient = new THREE.AmbientLight(0xffffff, 0.5);
 scene.add(ambient);

 let ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20,100),
  new THREE.MeshStandardMaterial({color:0x222222})
 );
 ground.rotation.x = -Math.PI/2;
 scene.add(ground);

 createPlayer(scene);
 setInterval(()=>{
 spawnGates(scene);
}, 8000);
 setupControls();
let spawnRate = 1000;

setInterval(()=>{
 spawnZombie(scene);
}, spawnRate);

// 👉 Schwierigkeit steigern
setInterval(()=>{
 if(spawnRate > 300){
  spawnRate -= 50;
 }
}, 3000);
setInterval(()=>{
 let player = getPlayer();

 for(let i = 0; i < bulletCount; i++){

  let offset = (i - (bulletCount-1)/2) * 0.5;

  shoot(scene, player, offset);
 }

}, fireRate);
}

export function startGame(){
 animate();
}

let lastTime = 0;

function animate(time){


    
 requestAnimationFrame(animate);

 let delta = (time - lastTime) / 16.67; // 👈 NORMALISIERUNG
 lastTime = time;

 updatePlayer();

// 🧟 ZUERST Zombies bewegen
updateZombies(scene, getPlayer(), () => {
 hp -= 10;

 if(hp < 0) hp = 0;
}, delta);

updateCoins(scene, getPlayer(), (value = 1) => {
 coinCount += value;
}, delta);



// 🔫 DANN Kugeln (weil sie Zombies treffen)
updateBullets(scene, getZombies(), delta);

// 🚪 DANACH Gates (weil Spieler durchläuft)
updateGates(scene, getPlayer(), (upgrade)=>{

 if(upgrade === "+Speed"){
  fireRate *= 0.8;
  
 } 

 if(upgrade === "+Bullets"){
  bulletCount++;
 }

}, delta);
document.getElementById("hpfill").style.width = hp + "%";
document.getElementById("hptext").innerText = hp + " HP";
document.getElementById("coins").innerText = coinCount;
 renderer.render(scene, camera);
}