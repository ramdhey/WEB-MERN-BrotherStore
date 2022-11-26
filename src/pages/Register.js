import { Button, Card, Container, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from 'axios';
import React,{useState,useEffect} from "react";
import {useContext} from "react";
import { Store } from '../StoreNContext/Store';
import { toast } from "react-toastify";
import { getError } from '../utils';

function Register() {
    const navigate = useNavigate()
    const {search} = useLocation
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl ? redirectInUrl : "/"

    const [email,setEmail] = useState('')
    const [name,setName] = useState('')
    const [password,setPassword] = useState('')
    const [konfirm,setKonfirm] = useState('')


    const {state,dispatch:ctxDispatch} = useContext(Store)
    const {userInfo} =state


    const submitHandler = async(e)=>{
        e.preventDefault()
        if(password !== konfirm){
          toast.error('Password tidak sama')
          return
        }
        try {
            const {data} = await axios.post('/user/register',{
                name,email,password
            })
            ctxDispatch({type:'USER_LOGIN',payload:data})
            localStorage.setItem('userInfo',JSON.stringify(data))
            navigate(redirect || "/")
            
        } catch (err) {
            toast.error(getError(err))
            
        }
    }

    useEffect(()=>{
      if(userInfo){
        navigate(redirect)
      }
    },[navigate,redirect,userInfo])


  return (
    <Container className="small-container">
      <Helmet>
        <title>Register Page</title>
      </Helmet>
      <h1 className="my-3">Login</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" required onChange={(e)=>setEmail(e.target.value)} />
        </Form.Group>


        <Form.Group className="mb-3" controlId="name">
          <Form.Label>FullName</Form.Label>
          <Form.Control type="text" placeholder="Enter FUllName" required onChange={(e)=>setName(e.target.value)} />
        </Form.Group> 

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" required  onChange={(e)=>setPassword(e.target.value)}/>
        </Form.Group>


        <Form.Group className="mb-3" controlId="confirm">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" placeholder="Confirm Password" required  onChange={(e)=>setKonfirm(e.target.value)}/>
        </Form.Group>


        <div>
          <Button type="submit">Register</Button>
        </div>

        <div className="akuntanya">
          <p>
            Sudah Punya Akun?{" "}
            <span>
              {"   "}
              <Link to={`/login?redirect=${redirect}`}>Login</Link>
            </span>
          </p>
        </div>

      </Form>
    </Container>
  );
}

export default Register;
