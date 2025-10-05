import React, { createContext, useState, useContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export type DoctorContextValue = {
  dToken: string;
  setDToken: React.Dispatch<React.SetStateAction<string>>;
  backendUrl: string | undefined;
  appointments: any[];
  getAppointments: () => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  completeAppointment: (appointmentId: string) => Promise<void>;
  dashData: any | false;
  getDashData: () => Promise<void>;
  profileData: any | false;
  setProfileData: React.Dispatch<React.SetStateAction<any | false>>;
  getProfileData: () => Promise<void>;
}

export const DoctorContext = createContext<DoctorContextValue | undefined>(undefined)

export const useDoctorContext = (): DoctorContextValue => {
  const ctx = useContext(DoctorContext)
  if (!ctx) throw new Error('DoctorContext not found. Wrap with DoctorContextProvider.')
  return ctx
}

type Props = { children?: React.ReactNode }

const DoctorContextProvider: React.FC<Props> = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL as string | undefined

    const [dToken, setDToken] = useState<string>(localStorage.getItem('dToken') ? localStorage.getItem('dToken') as string : '')
    const [appointments, setAppointments] = useState<any[]>([])
    const [dashData, setDashData] = useState<any | false>(false)
    const [profileData, setProfileData] = useState<any | false>(false)

    // Getting Doctor appointment data from Database using API
    const getAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/doctor/appointments', { headers: { dToken } })

            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }

        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting Doctor profile data from Database using API
    const getProfileData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/doctor/profile', { headers: { dToken } })
            console.log(data.profileData)
            setProfileData(data.profileData)

        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel doctor appointment using API
    const cancelAppointment = async (appointmentId: string) => {

        try {

            const { data } = await axios.post(backendUrl + '/doctor/cancel-appointment', { appointmentId }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // after creating dashboard
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error: any) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to Mark appointment completed using API
    const completeAppointment = async (appointmentId: string) => {

        try {

            const { data } = await axios.post(backendUrl + '/doctor/complete-appointment', { appointmentId }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // Later after creating getDashData Function
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error: any) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Getting Doctor dashboard data using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/doctor/dashboard', { headers: { dToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const value: DoctorContextValue = {
        dToken, setDToken, backendUrl,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData, getDashData,
        profileData, setProfileData,
        getProfileData,
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )


}

export default DoctorContextProvider
