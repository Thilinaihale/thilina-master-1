import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import RuchiraLankaSignup from "./components/Signup";
import MakeAppointment from "./components/MakeAppointment";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<UserDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<RuchiraLankaSignup />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/appointments" element={<MakeAppointment />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
