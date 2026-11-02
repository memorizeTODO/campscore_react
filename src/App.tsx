//import logo from './logo.svg';
import './App.css';
import { Button } from "flowbite-react";
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage.tsx';
import SearchResult from './pages/SearchResult.tsx';
import DetailPage from './pages/DetailPage.tsx';
import Header from "./components/Header.tsx";
import MyAccountPage from './pages/MyAccountPage.tsx';


function App() {
  
    return (
    
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<MainPage />} /> 
            <Route path="/main" element={<MainPage />} />
            <Route path="/search" element={<SearchResult />} />
            <Route path="/detail" element={<DetailPage />} />
            <Route path="/myaccount" element={<MyAccountPage />} />
          </Routes>
        </Router>
    );
  
}

export default App;
