import axios from "axios"
import { ACCESS_TOKEN } from "./constants"


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// An interceptor acts like a checkpoint or a middleman. This line tells Axios: "Hey,
// ..every single time I am about to send an HTTP request using this api instance,
// ..stop it right before it leaves the browser and run the following code first."
api.interceptors.request.use(
  // config is an object that holds all the settings for the outgoing request
  // ..(like the URL, the method, and the headers).
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Crucial step: it returns the modified config object so Axios can finally send the
    // ..request out to the internet. If you forgot to return this, the request would just hang forever.
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api