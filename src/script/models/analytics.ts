import * as $ from 'jquery';

console.log('analytics');
console.log('new');

var counter = 0;

$(document).on('click', () => {
  counter++;
  console.log(counter);
})
