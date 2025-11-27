import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer: React.FC = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        <div>
          <Link to="/">
            <img className='mb-5 w-40' src={assets.logo} alt="Mech Logo" />
          </Link>
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>A Mech é sua parceira confiável para gerenciar sua saúde com praticidade e eficiência. Agende consultas e gerencie seus cuidados com facilidade.</p>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>EMPRESA</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>
              <Link to="/" className='hover:text-blue-600 transition-colors duration-200'>
                Início
              </Link>
            </li>
            <li>
              <Link to="/about" className='hover:text-blue-600 transition-colors duration-200'>
                Sobre nós
              </Link>
            </li>
            <li>
              <Link to="/contact" className='hover:text-blue-600 transition-colors duration-200'>
                Contato
              </Link>
            </li>
            <li>
              <a 
                href="/privacy-policy" 
                className='hover:text-blue-600 transition-colors duration-200'
                onClick={(e) => {
                  e.preventDefault()
                  alert('Política de privacidade em breve')
                }}
              >
                Política de privacidade
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className='text-xl font-medium mb-5'>CONTATO</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>
              <a 
                href="tel:+5581999999999" 
                className='hover:text-blue-600 transition-colors duration-200'
              >
                (81) 99999-9999
              </a>
            </li>
            <li>
              <a 
                href="mailto:contato@mech.com" 
                className='hover:text-blue-600 transition-colors duration-200'
              >
                contato@mech.com
              </a>
            </li>
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
