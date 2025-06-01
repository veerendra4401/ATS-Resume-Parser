const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create a 32x32 canvas
const canvas = createCanvas(32, 32);
const ctx = canvas.getContext('2d');

// Set background
ctx.fillStyle = '#2563eb'; // Blue background
ctx.fillRect(0, 0, 32, 32);

// Draw document icon
ctx.fillStyle = '#ffffff';
ctx.beginPath();
ctx.moveTo(8, 4);
ctx.lineTo(20, 4);
ctx.lineTo(24, 8);
ctx.lineTo(24, 28);
ctx.lineTo(8, 28);
ctx.closePath();
ctx.fill();

// Draw lines (representing text)
ctx.fillStyle = '#2563eb';
ctx.fillRect(11, 12, 10, 2);
ctx.fillRect(11, 16, 10, 2);
ctx.fillRect(11, 20, 10, 2);

// Save the favicon
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), buffer);
console.log('Favicon generated successfully!'); 