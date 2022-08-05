import axios from 'axios'
import decode from 'jwt-decode'

const URL = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL })

URL.interceptors.request.use((req) => {
    const userData = localStorage.getItem('userData')
  
    if (userData) {
      const userToken = JSON.parse(userData).token
  
      req.headers.Authorization = `Bearer ${userToken}`
  
      const decodedToken = decode(userToken)
  
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        window.location.reload(false)
        // eslint-disable-next-line no-alert
        alert('Your token expired, please sign in again')
      }
    }
    return req
})

/** APIs */

//users
export const signup = URL.post(`/users/signup`)
export const login = URL.post(`/users/login`)
export const logout = URL.post(`/users/logout`)
export const getMe = URL.get(`/users/me`)
export const updateMe = URL.patch(`/users/me`)

//admin user management
export const getAllUsers = URL.get(`/users/all`)
export const createUser = URL.post(`/users/createUser`)
export const updateUser = URL.post(`/users/updateUser`)
export const updatePassword = URL.post(`/users/updatePassword`)


