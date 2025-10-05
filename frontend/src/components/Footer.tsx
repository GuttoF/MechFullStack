import React from 'react'
import { assets } from '../assets/assets'

const Footer: React.FC = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>A Mech é sua parceira confiável para gerenciar sua saúde com praticidade e eficiência. Agende consultas e gerencie seus cuidados com facilidade.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>EMPRESA</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>Início</li>
            <li>Sobre nós</li>
            <li>Entregas</li>
            <li>Política de privacidade</li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>CONTATO</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>(81) 99999-9999</li>
            <li>contato@mech.com</li>
          </ul>
        </div>

      </div>

      <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025 @ Mech.com - Todos os direitos reservados.</p>
      </div>

    </div>
  )
}

export default Footer
