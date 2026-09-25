import Alpine from 'alpinejs';
import { gameData } from './game/index.js';

window.Alpine = Alpine;

document.addEventListener('alpine:init', () => {
    Alpine.data('gameData', gameData);
});

Alpine.start();
