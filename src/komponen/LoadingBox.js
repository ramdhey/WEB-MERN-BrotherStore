import React from 'react';
import { Spinner } from 'react-bootstrap';

export default function LoadingBox () {
    return (

        <Spinner animation="border" variant="success" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    
    );
};
