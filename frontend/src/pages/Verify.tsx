import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Verify: React.FC = () => {

    const [searchParams] = useSearchParams()

    const success = searchParams.get('success')
    const appointmentId = searchParams.get('appointmentId')

    const { backendUrl, token } = useAppContext()

    const navigate = useNavigate()

    const verifyStripe = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/user/verifyStripe', { success, appointmentId }, { headers: { token } })
            if (data.success) {
                toast.success('Pagamento confirmado')
            } else {
                toast.error('Falha no pagamento')
            }
            navigate('/my-appointments')
        } catch (error: any) {
            toast.error(error.message)
            console.log(error)
        }
    }

    useEffect(() => {
        if (token && appointmentId && success) {
            verifyStripe()
        }
    }, [token])

    return (
        <div className='min-h-[60vh] flex items-center justify-center'>
            <div className='w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin'></div>
        </div>
    )
}

export default Verify
