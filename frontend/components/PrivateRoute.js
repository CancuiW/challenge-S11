import React from 'react';
import {  Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
    if (localStorage.getItem('token')) {
        return element;
    } else {
        return <Navigate to="/" replace />;
    }
};

export default PrivateRoute;

