import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(
    () => !!localStorage.getItem('vv_signed_in')
  )

  function signIn() {
    localStorage.setItem('vv_signed_in', '1')
    setIsSignedIn(true)
  }

  function signOut() {
    localStorage.removeItem('vv_signed_in')
    setIsSignedIn(false)
  }

  return (
    <AuthContext.Provider value={{ isSignedIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
