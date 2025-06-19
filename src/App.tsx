import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import AdminLanding from './Pages/AdminLanding';
import AdminResources from './Pages/AdminResources';
import Registration from './Pages/Registration';
import Resources from './Pages/Resources';
import Login from './Pages/Login';
// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import type { RootState } from './Redux/Store';
const App = () => {

  // const [IsAdmin, setIsAdmin] = useState<boolean>(false);
  // const [IsUser, setIsUser] = useState<boolean>(false);
  // const User = useSelector((state: RootState) => state.user.user)
  // useEffect(() => {
  //   if ((User !== null && User.role === "USER" && localStorage.getItem("tabataToken"))) {
  //     setIsAdmin(false);
  //     setIsUser(true);
  //   } else if ((User !== null && User.role === "ADMIN" && localStorage.getItem("tabataToken"))) {
  //     setIsAdmin(true);
  //     setIsUser(false);
  //   } else if (User === null && !localStorage.getItem("tabataToken")) {
  //     setIsAdmin(true);
  //     setIsUser(false);
  //   }
  // }, [])

  
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/admin/dashbord" element={<AdminLanding />} />
      <Route path="/admin/resources" element={<AdminResources />} />
      <Route path="/login" element={<Login />} />
      <Route path='/registration' element={<Registration />} />

        {/* {IsUser || (!IsUser && !IsAdmin)  && <>
        <Route path="/" element={<Home />} />
          <Route path="/resources" element={<Resources />} />
        </>
        }
        {IsAdmin && <>
          <Route path="/admin/dashbord" element={<AdminLanding />} />
          <Route path="/admin/resources" element={<AdminResources />} />
        </>}
        {!IsAdmin && !IsUser && <>
          <Route path="/login" element={<Login />} />
          <Route path='/registration' element={<Registration />} />
        </>} */}
      </Routes>
    </Router>
  )
}

export default App
