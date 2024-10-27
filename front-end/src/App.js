import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import './App.css';
import Home from './components/home';

function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<Home></Home>}/>

    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
