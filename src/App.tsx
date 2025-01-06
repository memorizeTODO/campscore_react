//import logo from './logo.svg';
import './App.css';
import { Button } from "flowbite-react";
import React from 'react';
import MainPage from './MainPage.tsx';
import SearchPage from './SearchResult.tsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  
    return (
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} /> 
          <Route path="/main" element={<MainPage />} />
          <Route path="/search" element={<SearchResult />} />
        </Routes>
      </Router>
    );
  
}

export default App;
