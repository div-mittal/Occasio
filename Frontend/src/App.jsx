import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Landing from "./pages/Landing.jsx";
import About from "./pages/About.jsx";
import Events from "./pages/Events.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Signup from "./pages/Signup.jsx";
import Add from "./pages/Add.jsx";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/events' element={<Events/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path='/add' element={<Add/>} />
      </Routes>
    </>
  );
}

export default App;
