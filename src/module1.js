function privateFunc() {
    console.log('Вызов приватной функции модуля');
 }
  
 function publicFunc(name) {
    privateFunc();
    console.log('Вызов публичной функции из модуля');
    console.log(`Привет, ${name}!`);
 }
  
 export default publicFunc;