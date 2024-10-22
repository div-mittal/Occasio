import { Route, Routes } from "react-router-dom";
import Login from "./pages/login.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element />
        <Route path="/login" element={<Login/>} />
      </Routes>
    </>
  );
}

export default App;
