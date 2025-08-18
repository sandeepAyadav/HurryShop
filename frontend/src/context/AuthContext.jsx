import React, { createContext } from 'react'
export const authDataContext = createContext();
function authContext({children}) {
    let serverUrl = import.meta.env.VITE_API_BASE_URL;
    
     let value = {
      serverUrl
     };
  return (
   
    <div>
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
      
    </div>
  )
}

export default authContext
