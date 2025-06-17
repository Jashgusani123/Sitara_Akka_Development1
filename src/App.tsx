import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import AdminLanding from './Pages/AdminLanding';
import AdminResources from './Pages/AdminResources';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/dashbord" element={<AdminLanding />} />
        <Route path="/admin/resources" element={<AdminResources/>} />
      
      </Routes>
    </Router>
  )
}

export default App
