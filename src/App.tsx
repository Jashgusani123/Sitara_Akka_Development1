import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import AdminLanding from './Pages/AdminLanding';
import AdminResources from './Pages/AdminResources';
import Registration from './Pages/Registration';
import Resources from './Pages/Resources';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/admin/dashbord" element={<AdminLanding />} />
        <Route path="/admin/resources" element={<AdminResources/>} />
        <Route path='/registration' element={<Registration />} />
      </Routes>
    </Router>
  )
}

export default App
