import { useState } from 'react';
import { LoginUser } from '../APIs/PostAPIs';
import { Snackbar } from '@mui/material';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleLogin = async(e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(phone)) {
      setError('Phone number must be 10 digits');
      return;
    }

    setError('');
    console.log("Logging in with:", phone);
   const res =  await LoginUser({phone});
   if(res){
    setOpenSnackbar(true);
    setMessage("Login successful")
    setTimeout(() => setOpenSnackbar(false), 2000);
   }
  };

  return (
    <>
    <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto p-4">
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value.trim())}
        placeholder="Enter Phone Number..."
        className="w-full p-3 border border-gray-300 rounded-xl"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-xl font-semibold"
      >
        Login
      </button>
    </form>
    {message && <Snackbar
        open={openSnackbar}
        message="Login Successful !!"
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        ContentProps={{
          sx: {
            backgroundColor: "#FFD004",
            color: "black",
            fontWeight: "bold",
            fontSize: "16px",
            borderRadius: "8px",
          },
        }}
      />}
      </>
  );
};

export default Login;
