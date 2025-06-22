import { useState } from 'react';
import { LoginUser } from '../APIs/PostAPIs';
import { Snackbar, CircularProgress } from '@mui/material';
import Image from '../assets/Register Image.png';
import Logo from '../assets/Logo.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(phone)) {
      setError('Phone number must be 10 digits');
      return;
    }

    setError('');
    setLoading(true); 
    const res = await LoginUser({ phone , dispatch , setError });
    setLoading(false); 

    if (res) {
      setMessage("Login successful");
      setOpenSnackbar(true);
      setTimeout(() => setOpenSnackbar(false), 2000);
    }
  };

  const handleRegistrationRequest = () => {
    navigate("/registration");
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
        <div className="text-center flex items-center gap-4 justify-start">
          <img src={Logo} alt="Logo" className="h-16 w-16 border-3 border-[#FAC54D] object-contain bg-zinc-100 rounded-2xl" />
          <div className='flex flex-col justify-start'>
            <h2 className="text-3xl items-start flex justify-start text-black font-bold">LOGIN</h2>
            <p className='text-zinc-600'>If Already Have an Account.</p>
          </div>
        </div>

        <label className="text-sm text-zinc-600 px-2">
          <span className="text-zinc-900 font-medium">Phone Number</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.trim())}
          placeholder="Enter Phone Number"
          className="w-full p-3 rounded-lg text-black border focus:outline-none focus:ring-2 focus:ring-white"
        />
        {error && <p className="text-red-800 flex justify-center text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#FAC54D] hover:bg-yellow-200 text-black font-semibold py-2 rounded-lg transition flex justify-center items-center gap-2 disabled:opacity-50"
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

        <span className='flex justify-center text-black w-full items-center gap-2'>
          I haven't an Account,
          <button className='text-blue-800 cursor-pointer' onClick={handleRegistrationRequest}>
            Registration
          </button>
        </span>
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
