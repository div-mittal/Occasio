import { Route, Routes } from "react-router-dom";
import Temp from "./pages/Temp.jsx";
import Hello from "./pages/Hello.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Temp/>} />
        <Route path="/hello" element={<Hello/>} />
      </Routes>
    </>
  );
}

export default App;
