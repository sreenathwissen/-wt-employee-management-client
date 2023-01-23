import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar";
const App = () => {
  return (
    <Router>
      <div className="App">
        <Sidebar />
      </div>
    </Router>
  );
};

export default App;
