import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export type AdminContextValue = {
  aToken: string;
  setAToken: React.Dispatch<React.SetStateAction<string>>;
  doctors: any[];
  getAllDoctors: () => Promise<void>;
  changeAvailability: (docId: string) => Promise<void>;
  appointments: any[];
  getAllAppointments: () => Promise<void>;
  getDashData: () => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  dashData: any | false;
};

export const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export const useAdminContext = (): AdminContextValue => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("AdminContext not found. Wrap with AdminContextProvider.");
  return ctx;
};

type Props = { children?: React.ReactNode };

const AdminContextProvider: React.FC<Props> = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;

  const [aToken, setAToken] = useState<string>(localStorage.getItem("aToken") ? (localStorage.getItem("aToken") as string) : "");

  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [dashData, setDashData] = useState<any | false>(false);

  // Getting all Doctors data from Database using API
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/admin/all-doctors", { headers: { aToken } });
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Function to change doctor availablity using API
  const changeAvailability = async (docId: string) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/admin/change-availability",
        { docId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Getting all appointment data from Database using API
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/admin/appointments", { headers: { aToken } });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Function to cancel appointment using API
  const cancelAppointment = async (appointmentId: string) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  // Getting Admin Dashboard data from Database using API
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/admin/dashboard", { headers: { aToken } });

      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const value: AdminContextValue = {
    aToken,
    setAToken,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    getAllAppointments,
    getDashData,
    cancelAppointment,
    dashData,
  };

  return <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>;
};

export default AdminContextProvider;
