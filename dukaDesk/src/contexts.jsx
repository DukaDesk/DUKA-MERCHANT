import { createContext, useContext } from "react";

export const ToastContext = createContext();
export const AuthContext = createContext();

export const useToast = () => useContext(ToastContext);
export const useAuth = () => useContext(AuthContext);
