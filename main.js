import { initGame, startGame } from './js/game.js';

document.getElementById("playBtn").onclick = () => {
document.getElementById("hpbar").style.display = "block";
 document.getElementById("menu").style.display = "none";
 document.getElementById("gameUI").style.display = "block";


 initGame();
 startGame();
};