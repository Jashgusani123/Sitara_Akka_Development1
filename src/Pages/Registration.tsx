import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { RegistrationUser } from '../APIs/PostAPIs';
import Logo from '../assets/Logo.png';
import Image from '../assets/Register Image.png';
import { CircularProgress } from '@mui/material';

const Registration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState<number>(1);
  const [standard, setStandard] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();



    if (!/^\d{10}$/.test(phone)) {
      return setError('Phone number must be 10 digits');
    }

    if (!firstName.trim() || !lastName.trim()) {
      return setError('First and Last name are required');
    }

    if (!age || isNaN(age) || age < 3 || age > 100) {
      return setError('Enter a valid age between 3 and 100');
    }

    if (!standard.trim()) {
      return setError('Please enter your Standard');
    }

    if (!gender) {
      return setError('Please select your gender');
    }

    setLoading(true);
    const res = await RegistrationUser({ phone, firstName, lastName, age, standard, gender, dispatch, setMessage: setError });
    setTimeout(() => setError(""), 3000);
    setLoading(false);

    if (res) {
      setMessage("Registration Successfully Done !!");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white p-4">
      <img src={Image} alt="Registration" className="w-40 h-40 rounded-xl shadow-md mb-3" />

      <div className="bg-[#fcf7eb] shadow-2xl w-full max-w-xl rounded-3xl p-6">
        <div className="text-center flex items-center gap-4 mb-5 justify-start">
          <img src={Logo} alt="Logo" className="h-16 w-16 border-3 border-[#0E6BB0] object-contain bg-zinc-100 rounded-2xl" />
          <div className='flex justify-start flex-col'>
            <h2 className="text-3xl text-black items-start flex justify-start font-bold uppercase">Registration</h2>
            <p className='text-zinc-600'>If you already have an account, login instead.</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.trim())}
            placeholder="Phone Number"
            required
            className="w-full p-3 border border-gray-300 rounded-xl"
          />

          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="w-full p-3 border border-gray-300 rounded-xl"
          />

          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="w-full p-3 border border-gray-300 rounded-xl"
          />

          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            placeholder="Age"
            min={1}
            className="w-full p-3 border border-gray-300 rounded-xl"
          />

          <input
            type="text"
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
            placeholder="Standard (e.g., 10)"
            className="w-full p-3 border border-gray-300 rounded-xl"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-3 cursor-pointer border border-gray-300 rounded-xl text-gray-700"
          >
            <option value="" disabled>Select your Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          <button
            type="submit"
            className="w-full bg-[#fbc444] hover:bg-yellow-400 text-white py-3 rounded-xl text-lg font-medium transition flex items-center justify-center"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </button>
        </form>

        <span className='flex justify-center mt-6 items-center gap-2'>
          Already have an account?
          <button className='text-blue-800 cursor-pointer' onClick={() => navigate("/login")}>Login</button>
        </span>
      </div>
    </div>
  );
};

export default Registration;
