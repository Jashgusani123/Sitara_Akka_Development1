import { useState } from 'react'
import { SlBadge, SlInfo, SlMagnet, SlPhone, SlSocialFoursqare, SlUser } from 'react-icons/sl'
import Image from '../assets/Register Image.png'

const Registration = () => {
  const [step1, setStep1] = useState<boolean>(false)
  const [step2, setStep2] = useState<boolean>(false)
  const [step3, setStep3] = useState<boolean>(true)
  const [step4, setStep4] = useState<boolean>(false)
  return (
    <>
      <div className="registraction_container flex justify-center  flex-col items-center">
        <img src={Image} alt="" className='h-full w-50' />
        <div className="bg-[#FFD000] shadow-lg h-auto w-180 p-4 rounded-2xl">
          <div className="timeline flex justify-center gap-5 p-4">
            <div className='step1 flex w-26 bg-[#0E6BB0] p-4 rounded-2xl justify-center flex-col items-center'>
              <SlPhone size={30} color='#f0d86f' />
            </div>
            <div className='flex items-center  justify-center'>
              <p className='bg-black rounded-2xl  w-20 h-1 '></p>
            </div>
            <div className='step2 flex w-26 bg-[#0E6BB0] p-4 rounded-2xl flex-col items-center'>
              <SlUser size={30} color='#f0d86f' />
            </div>
            <div className='flex items-center justify-center'>
              <p className='bg-black rounded-2xl  w-20 h-1 '></p>
            </div>
            <div className='step3 flex w-26 bg-[#0E6BB0] p-4 rounded-2xl flex-col items-center'>
              <SlBadge size={30} color='#f0d86f' />
            </div>
            <div className='flex items-center justify-center'>
              <p className='bg-black rounded-2xl  w-20 h-1 '></p>
            </div>
            <div className='step4 flex w-26 bg-[#0E6BB0] p-4 rounded-2xl flex-col items-center'>
              <SlMagnet size={30} color='#f0d86f' />
            </div>
          </div>
          <form className='p-5 flex justify-around gap-5 flex-col'>
            {step1 && (
              <input type="tel" placeholder='Enter Phone Number ..' className='border-2 border-zinc-800 p-4 rounded-2xl' />
            )}
            {step2 && (
              <>
                <input type="text" placeholder='Firstname ...' className='border-2 border-zinc-800 p-4 rounded-2xl' />
                <input type="text" placeholder='Lastname ...' className='border-2 border-zinc-800 p-4 rounded-2xl' />
              </>
            )}
            {step3 && (
              <>
                <input type="text" placeholder='Enter your Gender ..' className='border-2 border-zinc-800 p-4 rounded-2xl' />
              </>
            )}

            {step4 && (
              <>
                <input type="text" placeholder='Enter your Age ..' className='border-2 border-zinc-800 p-4 rounded-2xl' />
              </>
            )}
            <button className='w-full bg-zinc-800 h-10 rounded-2xl text-white cursor-pointer'>Next</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Registration