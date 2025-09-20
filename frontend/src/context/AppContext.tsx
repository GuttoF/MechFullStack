import React, { createContext, useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

type UserData = any

export type AppContextValue = {
  doctors: any[];
  getDoctosData: () => Promise<void>;
  currencySymbol: string;
  backendUrl: string | undefined;
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  userData: UserData | false;
  setUserData: React.Dispatch<React.SetStateAction<UserData | false>>;
  loadUserProfileData: () => Promise<void>;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined)

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('AppContext not found. Wrap with AppContextProvider.')
  return ctx
}

type Props = { children?: React.ReactNode }

const AppContextProvider: React.FC<Props> = (props) => {

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL as string | undefined

    const [doctors, setDoctors] = useState<any[]>([])
    const [token, setToken] = useState<string>(localStorage.getItem('token') ? localStorage.getItem('token') as string : '')
    const [userData, setUserData] = useState<UserData | false>(false)

    // Getting Doctors using API
    const getDoctosData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/user/get-profile', { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => {
        getDoctosData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    const value: AppContextValue = {
        doctors, getDoctosData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider
// Modificado em Sun Oct  5 15:01:51 -03 2025
