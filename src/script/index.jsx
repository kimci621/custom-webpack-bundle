import styles from '../styles/index.scss';
import posts from '@db/posts.json';
import sample from '@db/sample.xml';
import sample2 from '@db/sample2.csv';
import { local_posts } from '@models/posts.ts'
import * as $ from 'jquery';
// react
import React from 'react';
import { render } from 'react-dom';

console.log('index');
console.log('index 2');
console.log(local_posts);
console.log('JSON', posts);
console.log('XML', sample);
console.log('CSV', sample2);

// $('pre').html(JSON.stringify(posts, null, 2));


// const test_array = [1,2,3,4];

// test_array.map(item => console.log(item))


// const test_promise = async () => {
//   const q = "1234"
//   return await q;
// }

// test_promise()

// class Util {
//   static id = Date.now();
// }

// console.log('UTil.id: ', new Util().id);


const App = () => (
  <div className='container'>
    <h1>Webpack course with React and TypeScript</h1>

    <hr/>

    <div className="img"></div>

    <hr/>

  </div>
)

render(<App />, document.getElementById('app'))
