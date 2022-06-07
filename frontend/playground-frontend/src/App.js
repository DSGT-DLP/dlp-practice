import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  
import Title from "./components/Title";
import Home from "./Home";
import About from "./components/About/About";
import Wiki from "./components/Wiki/Wiki";
function App() {
  return (
    <div>
      <Router>
        <Title />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Wiki" element={<Wiki />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
