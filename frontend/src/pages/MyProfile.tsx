import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile: React.FC = () => {

    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState<File | false>(false)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useAppContext()

    // Função para traduzir gênero para português
    const translateGender = (gender: string): string => {
        const genderMap: { [key: string]: string } = {
            'Male': 'Masculino',
            'Female': 'Feminino',
            'Other': 'Outro',
            'Not Selected': 'Não selecionado',
            'Masculino': 'Masculino',
            'Feminino': 'Feminino',
            'Outro': 'Outro',
            'Não selecionado': 'Não selecionado'
        }
        return genderMap[gender] || gender
    }

    // Função para formatar data no padrão brasileiro (DD/MM/YYYY)
    const formatDateBR = (dateString: string): string => {
        if (!dateString || dateString === 'Not Selected') return 'Não informado'
        
        try {
            // Se já estiver no formato YYYY-MM-DD
            if (dateString.includes('-')) {
                const [year, month, day] = dateString.split('-')
                return `${day}/${month}/${year}`
            }
            // Se já estiver no formato DD/MM/YYYY, retorna como está
            if (dateString.includes('/')) {
                return dateString
            }
            return dateString
        } catch (error) {
            return dateString
        }
    }

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();
            formData.append('name', (userData as any).name)
            formData.append('phone', (userData as any).phone)
            formData.append('address', JSON.stringify((userData as any).address))
            formData.append('gender', (userData as any).gender)
            formData.append('dob', (userData as any).dob)
            image && formData.append('image', image)
            const { data } = await axios.post(backendUrl + '/user/update-profile', formData, { headers: { token } })
            if (data.success) {
                toast.success('Perfil atualizado com sucesso')
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }
        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (userData ? (
        <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>

            {isEdit
                ? <label htmlFor='image' >
                    <div className='inline-block relative cursor-pointer'>
                        <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : (userData as any).image} alt="" />
                        <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
                    </div>
                    <input onChange={(e) => setImage((e.target.files && e.target.files[0]) || false)} type="file" id="image" hidden />
                </label>
                : <img className='w-36 rounded' src={(userData as any).image} alt="" />
            }

            {isEdit
                ? <input className='bg-gray-50 text-3xl font-medium max-w-60' type="text" onChange={(e) => setUserData((prev: any) => ({ ...prev, name: e.target.value }))} value={(userData as any).name} />
                : <p className='font-medium text-3xl text-[#262626] mt-4'>{(userData as any).name}</p>
            }

            <hr className='bg-[#ADADAD] h-[1px] border-none' />

            <div>
                <p className='text-gray-600 underline mt-3'>INFORMAÇÕES DE CONTATO</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]'>
                    <p className='font-medium'>Email:</p>
                    <p className='text-blue-500'>{(userData as any).email}</p>
                    <p className='font-medium'>Telefone:</p>

                    {isEdit
                        ? <input className='bg-gray-50 max-w-52' type="text" onChange={(e) => setUserData((prev: any) => ({ ...prev, phone: e.target.value }))} value={(userData as any).phone} />
                        : <p className='text-blue-500'>{(userData as any).phone}</p>
                    }

                    <p className='font-medium'>Endereço:</p>

                    {isEdit
                        ? <p>
                            <input className='bg-gray-50' type="text" onChange={(e) => setUserData((prev: any) => ({ ...prev, address: { ...(prev as any).address, line1: e.target.value } }))} value={(userData as any).address.line1} />
                            <br />
                            <input className='bg-gray-50' type="text" onChange={(e) => setUserData((prev: any) => ({ ...prev, address: { ...(prev as any).address, line2: e.target.value } }))} value={(userData as any).address.line2} /></p>
                        : <p className='text-gray-500'>{(userData as any).address.line1} <br /> {(userData as any).address.line2}</p>
                    }

                </div>
            </div>
            <div>
                <p className='text-[#797979] underline mt-3'>INFORMAÇÕES BÁSICAS</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
                    <p className='font-medium'>Gênero:</p>

                    {isEdit
                        ? <select className='max-w-20 bg-gray-50' onChange={(e) => setUserData((prev: any) => ({ ...prev, gender: e.target.value }))} value={(userData as any).gender} >
                            <option value="Not Selected">Não selecionado</option>
                            <option value="Male">Masculino</option>
                            <option value="Female">Feminino</option>
                            <option value="Other">Outro</option>
                        </select>
                        : <p className='text-gray-500'>{translateGender((userData as any).gender)}</p>
                    }

                    <p className='font-medium'>Nascimento:</p>

                    {isEdit
                        ? <input className='max-w-28 bg-gray-50' type='date' onChange={(e) => setUserData((prev: any) => ({ ...prev, dob: e.target.value }))} value={(userData as any).dob} />
                        : <p className='text-gray-500'>{formatDateBR((userData as any).dob)}</p>
                    }

                </div>
            </div>
            <div className='mt-10'>

                {isEdit
                    ? <button onClick={updateUserProfileData} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Salvar informações</button>
                    : <button onClick={() => setIsEdit(true)} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Editar</button>
                }

            </div>
        </div>
    ) : null)
}

export default MyProfile
