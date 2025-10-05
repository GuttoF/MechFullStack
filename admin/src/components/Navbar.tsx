import React from 'react'
import { assets } from '../assets/assets'
import { useDoctorContext } from '../context/DoctorContext'
import { useAdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar: React.FC = () => {

  const { dToken, setDToken } = useDoctorContext()
  const { aToken, setAToken } = useAdminContext()

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img onClick={() => navigate('/')} className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Médico'}</p>
      </div>
      <button onClick={() => logout()} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Sair</button>
    </div>
  )
}

export default Navbar
