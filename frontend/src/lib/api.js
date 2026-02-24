import { User } from "lucide-react";
import { axiosInstance } from "./axios";
import axios from "axios";
import { use } from "react";

export const signUp = async (signupData) => {
    const response = await axiosInstance.post("/auth/signup", signupData)
    return response.data;
}

export const getAuthUser = async () => {
     try {
         const res = await axiosInstance.get("/auth/me")
      return res.data;
     } catch (error) {
        console.log("Error fetching auth user:", error);
        return null;
     }
    }

export const completeOnboarding = async (UserData) => {
    const response = await axiosInstance.post("/auth/onboarding", UserData)
    return response.data;
}

export const login = async (loginData) => {
    const response  = await axiosInstance.post("/auth/login", loginData)
    return response.data;
}

export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
}

export const getUserFriends = async () => {
    const response = await axiosInstance.get("/users/friends");
    return response.data;
}

export const getRecomendedUsers = async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
}

export const getOutgoingFriendReqs = async () => {
    const response = await axiosInstance.get("/users/outgoing-friend-requests");
    return response.data;
}

export const sendFriendRequest = async (userId) => {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-request");
  return response.data;
}

export const acceptFriendRequest = async (requestId) => {
 const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`)   
 return response.data; 
}

export const getStreamToken = async () => {
    const response = await axiosInstance.get("/chat/token")
    return response.data; 
}