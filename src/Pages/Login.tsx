import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { CircularProgress, Snackbar } from '@mui/material';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoginUser } from '../APIs/PostAPIs';
import Logo from '../assets/Logo.png';
import Image from '../assets/Register Image.png';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const redirected = useRef(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(phone)) {
      setError('Phone number must be 10 digits');
      return;
    }

    setError('');
    setLoading(true);

    const res = await LoginUser({
      phone,
      dispatch,
      setMessage: setError
    });

    setLoading(false);

    if (res?.isAlreadyPresent) {
      redirected.current = true;

      setMessage("Login successful");
      setOpenSnackbar(true);

      setTimeout(() => {
        const targetLink = location.state?.externalLink;
        if (targetLink) {
          window.open(targetLink, '_blank');
        }

        const redirectTo = location.state?.from?.pathname || "/";
        const extraState = location.state?.data;
        
        navigate(redirectTo, {
          replace: true,
          state: { reset: true, data: extraState },
        });
      }, 500);
    }
    else{
        const extraState = location.state?.data;
        const redirectTo = location.state?.from?.pathname || "/";
        const targetLink = location.state?.externalLink;

      navigate("/registration" , {
          replace: true,
          state: { from:redirectTo,reset: true, data: extraState ,  externalLink:targetLink , number:res.number},
        });
    }

  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-blue-50 to-white p-6">
      <div className="w-full flex justify-center max-w-md mb-6">
        <img src={Image} alt="Login visual" className="w-40 h-40 rounded-xl shadow-md" />
      </div>

      <form
        onSubmit={handleLogin}
        className="bg-[#b5dfff] text-white w-full max-w-md p-6 rounded-2xl shadow-lg space-y-5"
      >
        <span
          onClick={() => navigate("/")}
          className="absolute left-4 top-4 cursor-pointer text-black hover:scale-110 transition-transform duration-200"
          title="Go back"
        >
          <KeyboardArrowLeftIcon fontSize="large" />
        </span>

        <div className="text-center flex items-center gap-4 justify-start">
          <img src={Logo} alt="Logo" className="h-16 w-16 border-3 border-[#FAC54D] object-contain bg-zinc-100 rounded-2xl" />
          <div className="flex flex-col justify-start">
            <h2 className="text-3xl items-start flex justify-start text-black font-bold">LOGIN</h2>
          </div>
        </div>

        <label className="text-sm text-zinc-600 px-2">
          <span className="text-zinc-900 font-medium">Phone Number</span>
        </label>
        <input
          type="tel"
          value={phone}
          maxLength={10}
          onChange={(e) => setPhone(e.target.value.trim())}
          placeholder="Enter Phone Number"
          className="w-full p-3 rounded-lg text-black border focus:outline-none focus:ring-2 focus:ring-white"
        />
        {error && <p className="text-red-800 flex justify-center text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#FAC54D] hover:bg-yellow-200 text-black font-semibold py-2 rounded-lg transition flex justify-center cursor-pointer items-center gap-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <>
              <CircularProgress size={20} thickness={5} color="inherit" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>

      {message && (
        <Snackbar
          open={openSnackbar}
          message={message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          ContentProps={{
            sx: {
              backgroundColor: '#FFD004',
              color: 'black',
              fontWeight: 'bold',
              fontSize: '16px',
              borderRadius: '8px',
            },
          }}
        />
      )}
    </div>
  );
};

export default Login;