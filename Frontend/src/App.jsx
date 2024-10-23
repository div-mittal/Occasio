import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Landing from "./pages/Landing.jsx";
import Testing from "./pages/Testing.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/testing" element={<Testing/>}/>
        <Route path="/login" element={<Login/>} />
      </Routes>
    </>
  );
}

export default App;
