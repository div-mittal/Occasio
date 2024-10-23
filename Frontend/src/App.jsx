import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Landing from "./pages/Landing.jsx";
import About from "./pages/About.jsx";
import Events from "./pages/Events.jsx";
<<<<<<< Updated upstream
import Signup from "./pages/Signup.jsx";
=======
import Dashboard from "./pages/Dashboard.jsx";

>>>>>>> Stashed changes
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/login" element={<Login/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/events' element={<Events/>} />
<<<<<<< Updated upstream
        <Route path="/signup" element={<Signup/>} />
=======
        <Route path="/dashboard" element={<Dashboard/>} />
>>>>>>> Stashed changes
      </Routes>
    </>
  );
}

export default App;
