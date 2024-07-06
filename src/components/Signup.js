import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';



const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const notifySignUp = () => toast.success('Success!', {
    position: "bottom-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"
    });
  const notifySignUpErr = () => toast.error('Username already exists!', {
    position: "bottom-center",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"
    });

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup`, {
        username,
        password,
      });
      notifySignUp();
      console.log('Signup successful:', response.data);
      navigate("/");
    } catch (error) {
      notifySignUpErr();
      console.error('Signup error:', error);
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

      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Signup</button>
      </form>
    </div>
    </div>
  );
};

export default Signup;
