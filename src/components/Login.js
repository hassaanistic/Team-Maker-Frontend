import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const notifyLoginErr = () => toast.error('Wrong Credentials!', {
    position: "bottom-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"
    });


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/login`, {
        username,
        password,
      });
    //   console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token);
      // Store token in localStorage
      navigate("/dashboard");
      // Store the token in localStorage or sessionStorage
    } catch (error) {
      notifyLoginErr()
      console.error('Login error:', error);
    }
  };

  return (
    <div style={{width:"100%",height:"100vh",display:'flex', justifyContent:'center', alignItems:'center', background:'#cded'}}>
        <ToastContainer
                position="bottom-center"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
    <div className="container bg-white p-2 rounded" style={{width:'300px'}}>

      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
    </div>
  );
};

export default Login;
