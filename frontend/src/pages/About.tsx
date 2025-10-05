import React from 'react'
import { assets } from '../assets/assets'

const About: React.FC = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#707070]'>
        <p>SOBRE <span className='text-gray-700 font-semibold'>NÓS</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Bem-vindo à Mech, sua parceira de confiança para gerenciar seus cuidados de saúde de forma prática e eficiente. Na Mech, entendemos os desafios de agendar consultas e organizar informações médicas.</p>
          <p>A Mech é comprometida com a excelência em tecnologia para saúde. Trabalhamos continuamente para aprimorar nossa plataforma, integrando os recursos mais recentes para melhorar a experiência do usuário e oferecer um serviço superior.</p>
          <b className='text-gray-800'>Nossa Visão</b>
          <p>Nossa visão na Mech é criar uma experiência de saúde simples e acessível para todos, aproximando pacientes e profissionais de saúde para que você tenha acesso ao cuidado que precisa, quando precisa.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>POR QUE <span className='text-gray-700 font-semibold'>ESCOLHER A GENTE</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>AGILIDADE</b>
          <p>Agendamento de consultas sem complicação, do seu jeito.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>CONVENIÊNCIA</b>
          <p>Acesso a uma rede de profissionais de confiança na sua região.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>PERSONALIZAÇÃO</b>
          <p>Recomendações e lembretes sob medida para você cuidar da sua saúde.</p>
        </div>
      </div>

    </div>
  )
}

export default About
