import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminLanding from './Pages/AdminLanding';
import AdminResources from './Pages/AdminResources';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Registration from './Pages/Registration';
import Resources from './Pages/Resources';
import type { RootState } from './Redux/Store';
import { GetUser } from './APIs/GetAPIs';

const App = () => {
  const [IsAdmin, setIsAdmin] = useState(false);
  const [IsUser, setIsUser] = useState(false);
  const [Checking, setChecking] = useState(true);
  const User = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_TOKEN);

    if (User && token) {
      if (User.role === "USER") {
        setIsUser(true);
        setIsAdmin(false);
      } else if (User.role === "ADMIN") {
        setIsAdmin(true);
        setIsUser(false);
      }
    } else if (!User && token) {
      GetUser({ dispatch })
    } else {
      setIsAdmin(false);
      setIsUser(false);
    }

    setChecking(false);
  }, [User]);


  if (Checking) return null;

  return (
    <Router>
      <Routes>
        {/* USER Routes */}
        {IsUser && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* ADMIN Routes */}
        {IsAdmin && (
          <>
            <Route path="/admin/dashbord" element={<AdminLanding />} />
            <Route path="/admin/resources" element={<AdminResources />} />
            <Route path="*" element={<Navigate to="/admin/dashbord" replace />} />
          </>
        )}

        {/* Unauthenticated - public */}
        {!IsAdmin && !IsUser && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
