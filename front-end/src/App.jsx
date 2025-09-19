import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Home from './page/home'
import Stats from './page/stats'
import "./App.css"


const App = () => {
  return (
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
       </Routes>
  )
}

export default App

