import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navbar';
import { BrowserRouter as Router, Route, BrowserRouter, Routes } from "react-router-dom";
import Elections from './components/Elections';

function App() {
  return (
    <div className="App">
      <Navigation />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Elections />} />
          <Route path="/dashboard" element={<Elections />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
