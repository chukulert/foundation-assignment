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
export const signup = (userData) => URL.post(`/users/signup`, userData)
export const login = (userData) =>  URL.post(`/users/login`, userData)
export const logout = () => URL.post(`/users/logout`)
export const getMe = () => URL.get(`/users/me`)
export const updateMe = (userData) => URL.patch(`/users/me`, userData)

//admin user management
export const getAllUsers = () => URL.get(`/users/all`)
export const createUser = (userData) => URL.post(`/users/createUser`, userData)
export const updateUser = (userData) => URL.patch(`/users/updateUser`, userData)
export const updatePassword = (userData) => URL.patch(`/users/updatePassword`, userData)
export const getAllGroups = () => URL.get(`/users/allgroups`) 

