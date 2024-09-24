import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

const App = () => {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/index" element={<Index />} />

        {/* If route is incorrect then it shows the 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
export default App
