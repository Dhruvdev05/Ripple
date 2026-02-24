import { Navigate, Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import NotificationsPage from "./pages/NotificationsPage"
import CallPage from "./pages/CallPage"
import ChatPage from "./pages/ChatPage"
import OnboardingPage from "./pages/OnboardingPage.jsx"

import toast, { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { axiosInstance } from "./lib/axios"
import PageLoader from "./components/PageLoader"
import { getAuthUser } from "./lib/api"
import useAuthUser from "./hooks/useAuthUser.js"
import Layout from "./components/Layout.jsx"
import { useThemeStore } from "./store/useThemeStore.js"

function App() {

 const {isLoading,authUser} = useAuthUser();

 const { theme , setTheme } = useThemeStore()

 const isAuthenticated = Boolean(authUser);
 const isOnboarded = authUser?.isOnboarded;


  if(isLoading) return <PageLoader/>

  
  return (
    <div className=" h-screen " data-theme={theme}>
     
   
    <Routes>
<Route path="/" 
element={isAuthenticated && isOnboarded ? (
  <Layout showSidebar={true}>
<HomePage />
  </Layout>

) :(
<Navigate to={isAuthenticated ? "/login" : "/onboarding"} />)}
 />

<Route path="/signup"
 element={!isAuthenticated ?
 <SignUpPage/> : 
 <Navigate to={isOnboarded ? "/" : "/onboarding"} />
 } />

<Route path="/login" 
element={!isAuthenticated ? 
<LoginPage /> : 
<Navigate to={isOnboarded ? "/" : "/onboarding"} />
 } />

<Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

<Route path="/call/:id" element={isAuthenticated && isOnboarded ? (
  <CallPage/>
) : (
  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
)
 } />

<Route path="/chat/:id" 
 element={isAuthenticated && isOnboarded ? (
  <Layout>
    <ChatPage />
  </Layout>
 ) : (
  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
 ) 
}/>

<Route path="/onboarding" element={isAuthenticated ? (
 !isOnboarded ? (<OnboardingPage />
 ) :(
 <Navigate to="/" />
 ) 
 ) : (<Navigate to="/login" /> 
 ) 
 }/>
      
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
