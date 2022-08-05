import { createContext } from 'react'
import useAuth from '../hooks/useAuth'
import React from 'react'
import * as api from '../api'

export const AuthContext = createContext(null)

const AuthProvider = (props) => {
  const [user, setUser] = useAuth()

  const signUp = async (newUserData) => {
    const { data: user } = await api.signup(newUserData)
    console.log(user)

    if (user.token) {
      localStorage.setItem('userData', JSON.stringify(user))
      setUser(user)
    }
    return user;
  }

  const logIn = async (userData) => {
    const { data: user } = await api.login(userData)
    console.log(user)

    if (user.token) {
      localStorage.setItem('userData', JSON.stringify(user))
      setUser(user)
    }

    if (!user.isActive) {
      localStorage.clear()
      setUser(null)
      alert('Account is blocked')
    }
    return user;
  }

  const signOut = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, signUp, logIn, signOut }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthProvider