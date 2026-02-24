import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http:localHost:5001/api" : "/api"

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,  

})