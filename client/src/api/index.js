import axios from 'axios'
import decode from 'jwt-decode'

const URL = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL })
const controller = new AbortController();

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

export const getAllGroups = () => URL.get(`/users/allgroups`,  {signal: controller.signal}) 

//admin user management
export const getAllUsers = () => URL.get(`/users/all`, {signal: controller.signal})
export const createUser = (userData) => URL.post(`/users/createUser`, userData)
export const updateUser = (userData) => URL.patch(`/users/updateUser`, userData)
export const updatePassword = (userData) => URL.patch(`/users/updatePassword`, userData)
export const createGroup = (groupData) => URL.post(`/users/allgroups`, groupData) 

//task management
export const getAllApplications = () => URL.get(`/tasks/applications`, {signal: controller.signal})
export const createApplication = (applicationData) => URL.post(`/tasks/applications`, applicationData)
export const editApplication = (appId, applicationData) => URL.patch(`/tasks/applications/${appId}`, applicationData)

//plans
export const getAllPlans = () => URL.get(`/tasks/plans`, {signal: controller.signal})
export const getApplicationPlans = (appId) => URL.get(`/tasks/${appId}/plans`, {signal: controller.signal})
export const createPlan = (appId, planData) => URL.post(`/tasks/${appId}/plans`, planData)

//task(s) fetching
export const getAllTasks = () => URL.get(`/tasks/tasks`, {signal: controller.signal})
export const findTask = (taskId) => URL.get(`/tasks/tasks/${taskId}`)

//application-based task operations
export const getAllApplicationTasks = (appId) => URL.get(`/tasks/${appId}`, {signal: controller.signal})
export const createTask = (appId, taskData) => URL.post(`/tasks/${appId}`, taskData)
export const updateTaskState = (appId, taskId, stateData) => URL.patch(`/tasks/${appId}/${taskId}`, stateData)
export const sendTaskEmail = (appId, taskId) => URL.post(`/tasks/${appId}/${taskId}/email`)
export const editTask = (appId, taskId, taskData) => URL.post(`/tasks/${appId}/${taskId}`, taskData)