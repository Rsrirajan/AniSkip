import fs from 'fs';
import { createCanvas } from 'canvas';

// Create a canvas
const canvas = createCanvas(512, 512);
const ctx = canvas.getContext('2d');

// Create gradient background
const gradient = ctx.createLinearGradient(0, 0, 512, 512);
gradient.addColorStop(0, '#8b5cf6');
gradient.addColorStop(1, '#3b82f6');

// Draw background circle
ctx.fillStyle = gradient;
ctx.beginPath();
ctx.arc(256, 256, 220, 0, 2 * Math.PI);
ctx.fill();

// Draw play button triangle
ctx.fillStyle = 'white';
ctx.beginPath();
ctx.moveTo(180, 140);
ctx.lineTo(180, 372);
ctx.lineTo(340, 256);
ctx.closePath();
ctx.fill();

// Add "SKIP" text
ctx.fillStyle = 'white';
ctx.font = 'bold 48px Arial';
ctx.textAlign = 'center';
ctx.fillText('SKIP', 256, 420);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('public/logo.png', buffer);

console.log('Logo generated successfully!'); 