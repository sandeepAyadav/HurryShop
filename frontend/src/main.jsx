import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import AuthContext from './context/authContext.jsx'
import "./index.css";
import UserContext from './context/UserContext.jsx'
import ShopContext from './context/ShopContext.jsx'
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthContext>
      <UserContext>
        <ShopContext>
           <App />
        </ShopContext>
      </UserContext>
    </AuthContext>
  </BrowserRouter>,
);
