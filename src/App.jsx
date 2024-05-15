import { Routes, Route } from "react-router";
import "./App.css";
import Register from "./components/register/Register";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/login/Login";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
