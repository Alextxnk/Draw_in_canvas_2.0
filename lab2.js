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


// лаб 2
const n = 100; // количество шагов по оси Ох
const maxX = 100; // максимальное значение Х (в методичке это L)
const maxT = 100; // максимальное значение времени

const hx = maxX / n; // // шаг по Х
const ht = 0.01; // шаг по времени
const u = 0.25; // произвольная константа, дана по условию

let mas = new Array(n); // массив в который запишем начальные значения (т.е. значения данной нам параболы)

/* let appData = {
   resObj: {},
   explicitScheme: {},
   implicitScheme: {},
   weightsScheme: {}
}; */

function first(x) {
   return -(Math.pow(x, 2) / 100) + 2 * x / 5 - 3; // уравнение параболы
}

function start(x) {
   // если число не в диапазоне от 10 до 30 (т.е. не на параболе), то возвращаем 0, 
   //чтобы потом в методах видеть погрешность
   if (x < 10 || x > 30) {
      return 0;
   }

   return first(x);
}


/**
 * Метод копирования массива
 * Сделать чтобы каждый раз не находить начальное распределение
 */
function copyMas(mas) {
   let result = new Array(mas.length);
   for (let i = 0; i < result.length; i++) {
      result[i] = mas[i];
   }

   return result;
}


/**
 * Схема "против потока" или же левый уголок
 * Используется формула 2.2 из методички
 */
function leftAngle(mas) {
   let present = copyMas(mas); // массив значений на данном шаге по времени
   let next = new Array(n); // массив значений на следующем шаге

   // цикл по времени
   for (let t = 0; t < maxT; t += ht) {
      // вычисляем значения на следующем шаге; цикл от 1, 
      // так как при расчетах используется значение предыдущего элемента

      for (let i = 0; i < n; i++) {
         next[i] = -u * ht * (present[i] - present[i - 1]) / hx + present[i];
      }

      // перезаписываем значения данного шага
      for (let i = 0; i < n; i++) {
         present[i] = next[i];
      }
   }

   return present;
}


/**
 * Центральная разностная схема
 * Используется формула 2.3
 */
function centralScheme(mas) {
   let present = copyMas(mas);
   let next = new Array(n);

   for (let t = 0; i < n; i++) {
      // цикл до N-1, так как теперь используется значение как предыдущего, так и следующего элемента

      for (let i = 1; i < n - 1; i++) {
         next[i] = -u * ht * (present[i + 1] - present[i - 1]) / 2 / hx + present[i];
      }

      for (let i = 1; i < n - 1; i++) {
         present[i] = next[i];
      }
   }

   return present;
}


/**
 * Схема "кабаре"
 * Формура 2.4
 */
function cabaret(mas) {
   let present = copyMas(mas);
   let next = new Array(n);
   let previous = copyMas(mas); // массив значений на предыдущем шаге

   for (let t = 0; t < maxT; t += ht) {

      for (let i = 1; i < n; i++) {
         next[i] = -2 * u * ht * (present[i] - present[i - 1]) / hx + previous[i - 1] - present[i - 1] + present[i];
      }

      for (let i = 1; i < n; i++) {
         previous[i] = present[i];
         present[i] = next[i];
      }
   }

   return present;
}


/**
 * Линейная комбинация центральной разностной схемы и схемы "кабаре"
 */
function centralSchemeCabaret(mas) {
   let present = copyMas(mas);
   let next = new Array(n);
   let previous = copyMas(mas);

   for (let t = 0; t < maxT; t += ht) {

      for (let i = 1; i < n - 1; i++) {
         // выражаем из формулы 2.5;     пошаговое выражение так же есть в архиве: "Лаб2, 4 метод.jpg";
         next[i] = (-u * ht * (present[i + 1] + 4 * present[i] - 5 * present[i - 1]) / 2 / hx + previous[i - 1] - present[i - 1]) / 2 + present[i]; 
      }

      for (let i = 1; i < n - 1; i++) {
         previous[i] = present[i];
         present[i] = next[i];
      }
   }

   return present;
}