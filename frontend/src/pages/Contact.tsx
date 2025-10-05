import React from 'react'
import { assets } from '../assets/assets'

const Contact: React.FC = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>FALE <span className='text-gray-700 font-semibold'>CONOSCO</span></p>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className=' font-semibold text-lg text-gray-600'>NOSSO ESCRITÓRIO</p>
          <p className=' text-gray-500'>Av. José Rodrigues de Jesus, Indianópolis <br /> Caruaru - PE, Brasil</p>
          <p className=' text-gray-500'>Tel: (81) 99999-9999 <br /> Email: contato@mech.com</p>
          <p className=' font-semibold text-lg text-gray-600'>CARREIRAS NA MECH</p>
          <p className=' text-gray-500'>Conheça nossas oportunidades e vagas abertas.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Ver vagas</button>
        </div>
      </div>

    </div>
  )
}

export default Contact
