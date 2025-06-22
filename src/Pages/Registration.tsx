import { useState } from 'react';
import { CiCalendarDate } from "react-icons/ci";
import { PiGenderIntersexLight } from "react-icons/pi";
import {
  SlPhone,
  SlUser
} from 'react-icons/sl';
import Image from '../assets/Register Image.png';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { MdOutlineClass } from "react-icons/md";
import { RegistrationUser } from '../APIs/PostAPIs';
import { useDispatch } from 'react-redux';
import Logo from '../assets/Logo.png';

const Registration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1)

  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState<number>(1);
  const [standard, setStandard] = useState('');
  const [gender, setGender] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const nextStep = () => {
    if (step === 1) {
      if (!/^\d{10}$/.test(phone)) {
        setError('Phone number must be 10 digits...');
        return;
      }
    } else if (step === 2) {
      if (!firstName.trim() || !lastName.trim()) {
        setError('First and Last name are required');
        return;
      }
    } else if (step === 3) {
      if (!age || isNaN(age) || +age < 3 || +age > 100) {
        setError('Enter a valid age between 3 and 100');
        return;
      }
    } else if (step === 4) {
      if (!standard.trim()) {
        setError('Please enter your Standard (e.g., 10th)');
        return;
      }
    } else if (step === 5) {
      if (!gender) {
        setError('Please select your gender');
        return;
      }
    }

    setError('');
    if (step < 5) setStep((prev) => prev + 1);
  };

  const getStepStyle = (index: number) =>
    `flex w-12 h-12 sm:w-16 sm:h-16 items-center justify-center rounded-full transition-all duration-300 ${step === index ? 'bg-yellow-400 shadow-lg scale-110' : 'bg-blue-600 opacity-60'
    }`

  const handleLoginRequest = () => {
    navigate("/login");
  }

  const handleRegistrationFormSubmit = async () => {
    const res = await RegistrationUser({ phone, firstName, lastName, age, standard, gender, dispatch })
    if (res) {
      setMessage("Registration Successfully Done !!")
    }
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white p-4">
      <img src={Image} alt="Registration" className="w-40 h-40 rounded-xl shadow-md mb-3" />

      <div className="bg-[#fcf7eb] shadow-2xl w-full max-w-xl rounded-3xl p-6">
        <div className="text-center flex items-center gap-4 mb-5 justify-start">
          <img src={Logo} alt="Logo" className="h-16 w-16 border-3 border-[#0E6BB0] object-contain bg-zinc-100 rounded-2xl" />
          <div className='flex flex-col justify-start '>
            <h2 className="text-3xl items-start flex justify-start text-black font-bold">Registration</h2>
            <p className='text-zinc-600'>If Already Haven't an Account.</p>
          </div>
        </div>
        {/* Timeline */}
        <div className="flex justify-between items-center mb-8 relative">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center relative">
              <div className={getStepStyle(i)}>
                {i === 1 && <SlPhone size={22} color="#ffff" />}
                {i === 2 && <SlUser size={22} color="#ffff" />}
                {i === 3 && <CiCalendarDate size={22} color="#ffff" />}
                {i === 4 && <MdOutlineClass size={22} color="#fff" />}
                {i === 5 && <PiGenderIntersexLight size={22} color="#fff" />}
              </div>
              <p className="text-xs mt-1">
                {['Phone', 'Name', 'Age', 'Standard', 'Gender'][i - 1]}
              </p>


            </div>
          ))}
        </div>

        <form className="space-y-4 transition-all duration-500" onSubmit={handleRegistrationFormSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="min-h-[80px]"
            >
              {step === 1 && (
                <>
                  <label className="text-sm text-zinc-600 px-2">
                    <span className="text-zinc-900 font-medium">Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.trim())}
                    placeholder="Enter Phone Number"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-white"
                  />
                </>
              )}

              {step === 2 && (
                <>
                  <label className="text-sm text-zinc-600 px-2">
                    <span className="text-zinc-900 font-medium">Fullname</span>
                    <span className="text-zinc-500"> (e.g. John Deo = Firstname - John)</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Firstname"
                    className="w-full p-3 mb-3 border border-gray-300 rounded-xl"
                  />
                  <label className="text-sm text-zinc-600 px-2">
                    <span className="text-zinc-900 font-medium">Lastname</span>
                    <span className="text-zinc-500"> (e.g. John Deo = Lastname - Deo)</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Lastname"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <label className="text-sm text-zinc-600 px-2">
                    <span className="text-zinc-900 font-medium">Age</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 1) setAge(value);
                    }}
                    min={1}
                    placeholder="Enter your Age"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />

                </>
              )}

              {step === 4 && (
                <>
                  <label className="text-sm text-zinc-600 px-2">
                    <span className="text-zinc-900 font-medium">Standard</span>
                    <span className="text-zinc-500"> (e.g. 10)</span>
                  </label>
                  <input
                    type="text"
                    value={standard}
                    onChange={(e) => setStandard(e.target.value)}
                    placeholder="Enter your Standard"
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </>
              )}

              {step === 5 && (
                <>
                  <label className="text-sm text-zinc-600 px-2">
                    <span className="text-zinc-900 font-medium">Gender</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-3 cursor-pointer border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="" disabled>Select your Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          <button
            type="button"
            onClick={step < 5 ? nextStep : handleRegistrationFormSubmit}
            className="w-full cursor-pointer bg-[#fbc444] hover:bg-yellow-400 text-white py-3 rounded-xl text-lg font-medium transition"
          >
            {step < 5 ? 'Next' : 'Finish'}
          </button>


        </form>
        <span className='flex justify-center mt-6 w-full items-center gap-2'>
          Already Have an Account,
          <button className='text-blue-800 cursor-pointer' onClick={handleLoginRequest}>Login</button>
        </span>
      </div>
    </div>
  )
}

export default Registration
