import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import RouterProject from "./Router/Route";
import NavBar from './komponen/Navbar';
import { Footer } from "./komponen/Footer";
import { Container } from "react-bootstrap";
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


function App() {
  return (
    <div className="d-flex flex-column sitecontainer">
      <ToastContainer position="bottom-center" limit={1}/>
      <header>
        <NavBar/>
      </header>

      <main>
      
        <RouterProject/>
     
        
      </main>
      <Footer/>
    </div>
  );
}

export default App;
