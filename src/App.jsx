import * as React from 'react';
// const title = 'World'
// const welcome = {
//   title: 'React',
//   greeting: 'Hey'
// }
// 一般使用函数定义式声明函数

const nameArray = ['a', 'b', 'c']

function getTitle() {
  return 'Hello World'
}

function getNameLis() {
  return nameArray.map((nameItem, index) => {
    return (
      <li key={index}>my name is { nameItem }!</li>
    )
  })
}

function App() {
  return (
    <div>
      <h1>{getTitle()}</h1>
      <ul>
        { getNameLis() }
      </ul>
      <label htmlFor='search'>Search: </label>
      <input id='search' type='text'/>
    </div>
  );
}

export default App;
