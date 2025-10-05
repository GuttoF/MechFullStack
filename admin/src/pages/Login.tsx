import React, { useEffect, useState } from 'react'
import { useAdminContext } from '../context/AdminContext'
import { useDoctorContext } from '../context/DoctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login: React.FC = () => {
  const [role, setRole] = useState<'admin' | 'doctor'>('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setAToken } = useAdminContext()
  const { setDToken } = useDoctorContext()

  const backendUrl = import.meta.env.VITE_BACKEND_URL as string | undefined

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (role === 'admin') {
        const { data } = await axios.post((backendUrl || '') + '/admin/login', { email, password })
        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
          toast.success('Login de admin realizado')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post((backendUrl || '') + '/doctor/login', { email, password })
        if (data.success) {
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          toast.success('Login de médico realizado')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white'>
        <p className='text-2xl font-semibold'>Entrar</p>
        <div className='w-full'>
          <p>Perfil</p>
          <select className='border border-[#DADADA] rounded w-full p-2 mt-1' value={role} onChange={(e) => setRole(e.target.value as any)}>
            <option value='admin'>Admin</option>
            <option value='doctor'>Médico</option>
          </select>
        </div>
        <div className='w-full'>
          <p>Email</p>
          <input className='border border-[#DADADA] rounded w-full p-2 mt-1' type='email' value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div className='w-full'>
          <p>Senha</p>
          <input className='border border-[#DADADA] rounded w-full p-2 mt-1' type='password' value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>Entrar</button>
      </div>
    </form>
  )
}

export default Login
