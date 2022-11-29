import { Button, Card, Container, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from 'axios';
import React,{useState,useEffect} from "react";
import {useContext} from "react";
import { Store } from './../StoreNContext/Store';
import { toast } from "react-toastify";
import { getError } from './../utils';

function LogIn() {
    const navigate = useNavigate()
    const {search} = useLocation
    const redirectInUrl = new URLSearchParams(search).get('redirect')
    const redirect = redirectInUrl ? redirectInUrl : "/"

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')


    const {state,dispatch:ctxDispatch} = useContext(Store)
    const {userInfo} =state


    const submitHandler = async(e)=>{
        e.preventDefault()
        try {
            const {data} = await axios.post('user/login',{
                email,password
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
        <title>Login Page</title>
      </Helmet>
      <h1 className="my-3">Login</h1>
      
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" required onChange={(e)=>setEmail(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" required  onChange={(e)=>setPassword(e.target.value)}/>
        </Form.Group>

        <div>
          <Button type="submit">Login</Button>
        </div>

        <div className="akuntanya">
          <p>
            Belum Punya Akun?{" "}
            <span>
              {"   "}
              <Link to={`/register?redirect=${redirect}`}>Register</Link>
            </span>
          </p>
        </div>

      </Form>
    </Container>
  );
}

export default LogIn;
