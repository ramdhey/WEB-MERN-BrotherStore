import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import RouterProject from "./Router/Route";
import NavBar from './komponen/Navbar';
import { Footer } from "./komponen/Footer";
import { Container } from "react-bootstrap";
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { createContext } from 'react';
import { useState } from 'react';

export const ThemeContext = createContext(null)

function App() {
  const [theme,setTheme] = useState("light")
  const toggleTheme=()=>{
    
    setTheme((curr)=>(curr === "light" ? "dark" : "light"))
  }
  return (
  <ThemeContext.Provider value={{theme,toggleTheme}}>
    <div id={theme}>
    <div className="d-flex flex-column sitecontainer">
      <ToastContainer position="bottom-center" limit={1}/>
      <header>
        <NavBar change={toggleTheme} chek={theme === "dark"} theme={theme} />
      </header>

      <main className="main">
      
        <RouterProject />
     
        
      </main>
      <Footer/>
    </div>
    </div>
    </ThemeContext.Provider>
  );
}

export default App;
