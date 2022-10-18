'use strict';


const canvasPlot = document.getElementById('canvas_plot');
const ctx = canvasPlot.getContext('2d'); // определяем контекст, чтобы получить доступ к элементам рисования 
// в canvas бывает два вида контекста 2d и 3d

/* // квадраты
ctx.fillRect(0, 0, 100, 100); // (x, y, xSize, ySize)
ctx.fillStyle = '#0000ff'; // синий
ctx.fillRect(100, 100, 200, 200);


// линии
// линия из (300, 300) в (400, 400)
ctx.beginPath(); // начинаем рисование
ctx.moveTo(300, 300);
ctx.lineTo(400, 400);
ctx.stroke(); // рисует саму линию
ctx.closePath(); // заканчиваем рисование

ctx.beginPath();
ctx.strokeStyle = '#ff0000';
ctx.moveTo(320, 300);
ctx.lineTo(400, 400);
ctx.stroke();
ctx.closePath();


// текст
ctx.font = '30px Arial';
ctx.textAlign = 'left'; // right, горизонталь
ctx.textBaseline = 'top'; // bottom, вертикаль 
ctx.fillText('Test', 300, 400);
ctx.fillRect(300, 400, 2, 2); */


// рисуем сетку
const canvasPlotWidth = canvasPlot.clientWidth;
const canvasPlotHeigth = canvasPlot.clientHeight;

const scaleX = 25;
const scaleY = 25;
const shiftNumberNames = scaleX / 10; // отступы для чисел на оси
const shiftAxisNames = scaleX / 2.5;
const shiftxAxisNames = scaleX / 1.6;

const xAxis = Math.round(canvasPlotWidth / scaleX / 2) * scaleX;
const yAxis = (canvasPlotHeigth / scaleY / 2) * scaleY;

ctx.font = `${Math.round(scaleX / 2)}px Arial`;
ctx.textAlign = 'left';
ctx.textBaseline = 'top';

// вертикальные линии
ctx.beginPath(); // начинаем рисование
ctx.strokeStyle = '#f5f0e8';

for (let i = 0; i <= canvasPlotWidth; i = i + scaleX) {
   ctx.moveTo(i, 0);
   ctx.lineTo(i, canvasPlotHeigth);

   ctx.fillText((i - xAxis) / scaleX, i + shiftNumberNames, yAxis + shiftNumberNames);
}

// горизонтальные линии
for (let i = 0; i <= canvasPlotHeigth; i = i + scaleY) {
   ctx.moveTo(0, i);
   ctx.lineTo(canvasPlotWidth, i);

   ctx.fillText((yAxis - i) / scaleY, xAxis + shiftNumberNames, i + shiftNumberNames);
}

ctx.stroke(); // рисует саму линию
ctx.closePath(); // заканчиваем рисование



// рисуем главные оси 
ctx.beginPath();
ctx.strokeStyle = '#000000';

ctx.moveTo(xAxis, 0); // старт
ctx.lineTo(xAxis, canvasPlotHeigth); // конец куда идет линия
ctx.fillText('y', xAxis - shiftAxisNames, 0);

ctx.moveTo(0, yAxis);
ctx.lineTo(canvasPlotWidth, yAxis);
ctx.fillText('x', canvasPlotWidth - shiftAxisNames, yAxis - shiftxAxisNames);

ctx.stroke(); 
ctx.closePath(); 


// рисуем график
// y = x^2
ctx.fillStyle = '#ff0000';
for (let i = 0; i <= canvasPlotWidth; i = i + 0.5) {
   const x = (i - xAxis) / scaleX;
   const y = Math.pow(x, 2);
   ctx.fillRect(x * scaleX + xAxis, yAxis - scaleY * y, 4, 4);
}