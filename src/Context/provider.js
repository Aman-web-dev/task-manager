'use client';
import AuthContextProvider from "./authContext";

export default function Providers({ children }) {
  return (
    <AuthContextProvider>
      {children}
    </AuthContextProvider>
  )
}