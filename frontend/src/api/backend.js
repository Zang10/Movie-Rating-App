import axios from 'axios'

const backend = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true
})

export default backend
