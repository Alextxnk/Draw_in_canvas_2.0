'use strict';


const canvasPlot = document.getElementById('canvas_plot');
const ctx = canvasPlot.getContext('2d'); // определяем контекст, чтобы получить доступ к элементам рисования 

// рисуем сетку
const canvasPlotWidth = canvasPlot.clientWidth;
const canvasPlotHeigth = canvasPlot.clientHeight;

const scaleX = 50;
const scaleY = 50;
const shiftNumberNames = scaleX / 10; // отступы для чисел на оси
const shiftAxisNames = scaleX / 2.5;
const shiftxAxisNames = scaleX / 1.6;

const xAxis = Math.round(canvasPlotWidth / scaleX / 2) * scaleX;
const yAxis = Math.round(canvasPlotHeigth / scaleY / 2) * scaleY;

ctx.font = `${Math.round(scaleX / 2)}px Arial`;

ctx.textAlign = 'right';
ctx.textBaseline = 'top';

// вертикальные линии
ctx.beginPath(); // начинаем рисование
ctx.strokeStyle = '#f5f0e8';

for (let i = 0; i <= canvasPlotWidth; i = i + scaleX) {
   ctx.moveTo(i, 0);
   ctx.lineTo(i, canvasPlotHeigth);

   ctx.fillText((i - scaleX) / scaleX, i - shiftNumberNames, canvasPlotHeigth - scaleY + shiftNumberNames);
}

// горизонтальные линии
for (let i = 0; i <= canvasPlotHeigth; i = i + scaleY) {
   ctx.moveTo(0, i);
   ctx.lineTo(canvasPlotWidth, i);

   ctx.fillText((canvasPlotHeigth - scaleY - i) / scaleY, scaleX - shiftNumberNames, i + shiftNumberNames);
}

ctx.stroke(); // рисует саму линию
ctx.closePath(); // заканчиваем рисование


// рисуем главные оси 
ctx.beginPath();
ctx.strokeStyle = '#000000';

ctx.moveTo(scaleX, 0);
ctx.lineTo(scaleX, canvasPlotHeigth);
ctx.fillText('y', scaleX + shiftAxisNames, 0);

ctx.moveTo(0, canvasPlotHeigth - scaleY);
ctx.lineTo(canvasPlotWidth, canvasPlotHeigth - scaleY);
ctx.fillText('x', canvasPlotWidth - shiftAxisNames, canvasPlotHeigth - scaleY - shiftxAxisNames);

ctx.stroke();
ctx.closePath();


const n = 300; // количество шагов
const h = 0.15; // длина шага
const y0 = 41; // начальное значение y

let appData = {
   resObj: {},
   explicitScheme: {},
   implicitScheme: {},
   weightsScheme: {}
};

function first(t, y) {
   return -(Math.pow(y, 2) / (9 + Math.pow(t, 2)));
}


// аналитическое -------------
appData.resObj[0] = y0;

for (let i = 1; i < n; i++) {
   let t = i * h;
   appData.resObj[i] = 1 / (1 / 3 * Math.atan(t / 3) + 1 / 41);
}

// рисуем график
ctx.fillStyle = '#000000';
for (let key in appData.resObj) {
   let x = (key - xAxis) / scaleX;
   let y = appData.resObj[key];
   ctx.fillRect(x * scaleX + xAxis + scaleX, canvasPlotHeigth - scaleY - scaleY * y, 2, 2);
}


// Явная схема ---------------
appData.explicitScheme[0] = y0;

for (let i = 0; i < n - 1; i++) {
   let t = i * h;
   let y = appData.explicitScheme[i];
   appData.explicitScheme[i + 1] = y + h * first(t, y);
}

// рисуем график
ctx.fillStyle = '#ff0000';
for (let key in appData.explicitScheme) {
   let x = (key - xAxis) / scaleX;
   let y = appData.explicitScheme[key];
   ctx.fillRect(x * scaleX + xAxis + scaleX, canvasPlotHeigth - scaleY - scaleY * y, 2, 2);
}


// Неявная схема -------------
appData.implicitScheme[0] = y0;

for (let i = 0; i < n - 1; i++) {
   let t = i * h;
   let y = appData.implicitScheme[i];
   let tn = 9 + Math.pow(t + h, 2);
   appData.implicitScheme[i + 1] = -tn / (2 * h) + Math.sqrt(Math.pow(tn / (2 * h), 2) + y * tn / h);
}

// рисуем график
ctx.fillStyle = '#00ff00';
for (let key in appData.implicitScheme) {
   let x = (key - xAxis) / scaleX;
   let y = appData.implicitScheme[key];
   ctx.fillRect(x * scaleX + xAxis + scaleX, canvasPlotHeigth - scaleY - scaleY * y, 2, 2);
}


// Схема с весами ------------
appData.weightsScheme[0] = y0;

for (let i = 0; i < n - 1; i++) {
   let t = i * h;
   let y = appData.weightsScheme[i];
   appData.weightsScheme[i + 1] = y + h * first(t + h / 2, y + h / 2 * first(t, y));
}

// рисуем график
ctx.fillStyle = '#0000ff';
for (let key in appData.weightsScheme) {
   let x = (key - xAxis) / scaleX;
   let y = appData.weightsScheme[key];
   ctx.fillRect(x * scaleX + xAxis + scaleX, canvasPlotHeigth - scaleY - scaleY * y, 2, 2);
}


// погрешность
let resObjArr = []; // аналитическое
let explicitSchemeDeviation = 0;
let explicitSchemeArr = []; // Явная схема
let implicitSchemeDeviation = 0;
let implicitSchemeArr = []; // Неявная схема
let weightsSchemeDeviation = 0;
let weightsSchemeArr = []; // Схема с весами

// аналитическое
for (let key in appData.resObj) {
   if (appData.resObj.hasOwnProperty(key)) {
      resObjArr.push(appData.resObj[key]);
   }
}

// Явная схема
for (let key in appData.explicitScheme) {
   if (appData.explicitScheme.hasOwnProperty(key)) {
      explicitSchemeArr.push(appData.explicitScheme[key]);
   }
}

// Неявная схема
for (let key in appData.implicitScheme) {
   if (appData.implicitScheme.hasOwnProperty(key)) {
      implicitSchemeArr.push(appData.implicitScheme[key]);
   }
}

// Схема с весами
for (let key in appData.weightsScheme) {
   if (appData.weightsScheme.hasOwnProperty(key)) {
      weightsSchemeArr.push(appData.weightsScheme[key]);
   }
}

// погрешность явной схемы
for (let i = 0; i < n; i++) {
   explicitSchemeDeviation += Math.abs(resObjArr[i] - explicitSchemeArr[i]) / resObjArr[i];
}
explicitSchemeDeviation /= n;
explicitSchemeDeviation *= 100;
explicitSchemeDeviation = explicitSchemeDeviation.toFixed(1);
console.log('Явная схема:', explicitSchemeDeviation + '%');

// погрешность неявной схемы
for (let i = 0; i < n; i++) {
   implicitSchemeDeviation += Math.abs(resObjArr[i] - implicitSchemeArr[i]) / resObjArr[i];
}
implicitSchemeDeviation /= n;
implicitSchemeDeviation *= 100;
implicitSchemeDeviation = implicitSchemeDeviation.toFixed(1);
console.log('Неявная схема:', implicitSchemeDeviation + '%');

// погрешность схемы весов
for (let i = 0; i < n; i++) {
   weightsSchemeDeviation += Math.abs(resObjArr[i] - weightsSchemeArr[i]) / resObjArr[i];
}
weightsSchemeDeviation /= n;
weightsSchemeDeviation *= 100;
weightsSchemeDeviation = weightsSchemeDeviation.toFixed(1);
console.log('Схема весов:', weightsSchemeDeviation + '%');