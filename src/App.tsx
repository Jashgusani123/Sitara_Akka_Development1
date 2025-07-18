import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Registration from './Pages/Registration';
import Resources from './Pages/Resources';
import type { RootState } from './Redux/Store';
import LanguageSelect from './Pages/LanguageSelect';

const App = () => {
  const [IsUser, setIsUser] = useState(false);
  const [Checking, setChecking] = useState(true);
  const User = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const token = localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_TOKEN);

    if (User && token) {
      if (User.role === "USER") {
        setIsUser(true);
      }
    } else if (!User && token) {
      localStorage.removeItem(import.meta.env.VITE_LOCAL_STORAGE_TOKEN);
    } else {
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
            <Route path="/language" element={<LanguageSelect />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

        {!IsUser && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/language" element={<LanguageSelect />} />
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
