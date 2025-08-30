// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/data" element={<div>Data view</div>} />
          <Route path="/chat" element={<div>Chat view</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

