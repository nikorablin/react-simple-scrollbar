import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from 'react-hot-loader';
import Ipsum from './ipsum';
import Scrollbar from '../src';

const App = () => [
  <h1 key="header">React Simple Scrollbar Demos</h1>,
  <h2 key="basicTitle">Basic w/ autoHide</h2>,
  <div key="basic" className="scrollbarContainer">
    <Scrollbar autoHide className="scrollbar">
      <Ipsum />
    </Scrollbar>
  </div>
];

export default hot(module)(App);
