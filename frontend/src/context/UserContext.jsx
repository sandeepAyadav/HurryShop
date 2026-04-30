import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext = createContext()

function UserContext({children}) {
  let [userData, setUserData] = useState("")
  let { serverUrl } = useContext(AuthDataContext)

  const getCurrentUser = async () => {
    try {
      let result = await axios.get(
        serverUrl + "/api/user/getcurrentuser",
        { withCredentials: true }
      )
      setUserData(result.data)
      console.log(result.data)
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  useEffect(() => {
    if(serverUrl) getCurrentUser()  // ✅ Fix
  }, [serverUrl])  // ✅ Fix

  let value = { userData, setUserData, getCurrentUser }

  return (
    <userDataContext.Provider value={value}>  {/* ✅ Fix */}
      {children}
    </userDataContext.Provider>
  )
}

export default UserContext
