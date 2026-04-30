import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthDataContext } from './AuthContext'
import axios from 'axios'

export const adminDataContext = createContext()

function AdminContext({children}) {
  let [adminData, setAdminData] = useState(null)
  let { serverUrl } = useContext(AuthDataContext)

  const getAdmin = async () => {
    try {
      let result = await axios.get(
        serverUrl + "/api/user/getadmin",
        { withCredentials: true }
      )
      setAdminData(result.data)       // ✅ fixed
      console.log(result.data)        // ✅ fixed
    } catch (error) {
      setAdminData(null)
      console.log(error)
    }
  }

  useEffect(() => {
    if(serverUrl) getAdmin()          // ✅ fixed
  }, [serverUrl])                     // ✅ fixed

  let value = { adminData, setAdminData, getAdmin }

  return (
    <adminDataContext.Provider value={value}>
      {children}
    </adminDataContext.Provider>
  )
}

export default AdminContext
