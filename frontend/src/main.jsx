import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import AuthContext from './context/AuthContext.jsx' // Ensure exact case match
import UserContext from './context/UserContext.jsx'
import ShopContext from './context/ShopContext.jsx'
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* Ensure the component name matches the export in AuthContext.jsx */}
   <AuthContext>
      <UserContext>
        <ShopContext>
           <App />
        </ShopContext>
      </UserContext>
    </AuthContext>
  </BrowserRouter>,
);