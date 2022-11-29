import React, { useState } from 'react'
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Searchbox() {
    // const navigate = useNavigate()
    // const [query,setQuery] =useState('')
    // const submitHandler = (e)=>{
    //     e.preventDefault()
    //     navigate(query ? `/search/?query=${query}`:'/search')
  return (
    // <Form className='d-flex me-auto' onSubmit={submitHandler}>
    //     <InputGroup>
    //     <FormControl type="text" name='q' id='q'  placeholder='Search' aria-label='Search' aria-aria-describedby='button-search'>
    //         <Button variant='outline-primaty' type="submit" id='btnSearch'><i fas fa-search></i></Button>

    //     </FormControl>
    //     </InputGroup>
    // </Form>

    <Form className='d-flex me-auto' >
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form>
  )
}
