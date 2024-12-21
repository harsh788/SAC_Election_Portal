import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navbar';
import { BrowserRouter as Router, Route, BrowserRouter, Routes } from "react-router-dom";
import Elections from './components/Elections';
import Participants from './components/Participants';
import Votes from './components/Votes';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <div className="App">
      <Navigation />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Elections />} />
          <Route path="/dashboard" element={<Elections />} />
          <Route path="/participants" element={<Participants />} />
          <Route path="/votes" element={<Votes />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
