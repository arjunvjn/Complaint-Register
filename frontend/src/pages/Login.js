import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Login() {
  const navigate = useNavigate();
  
  useEffect(()=>{
      if(localStorage.getItem('token'))
        navigate('/home')
    },[])
  


  // State hooks for username and password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Handler for username input change
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  // Handler for password input change
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Handle the login action (you can replace this with real authentication logic)
  const handleLogin = async() => {
    // Simple validation check
    if (username && password) {
      // If the credentials are valid, navigate to the Home page
      // console.log('Logging in with:', username, password);
      // navigate('/home');
      await axios.post('http://127.0.0.1:8000/user/login',{
        username:username,
        password:password
    }).then((res)=>{
        console.log(res)
        const user = jwtDecode(res.data.access);
        console.log(user)
        localStorage.setItem('token',res.data.access)
        if (user.is_admin)
          localStorage.setItem('is_admin',user.is_admin)
        navigate('/home')
    }).catch((err)=>console.log(err))
    } else {
      alert('Please enter both username and password');
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '100px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>

      {/* Username input */}
      <TextField
        fullWidth
        label="Username"
        margin="normal"
        value={username}
        onChange={handleUsernameChange}
      />

      {/* Password input */}
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={handlePasswordChange}
      />

      {/* Login button */}
      <Button fullWidth variant="contained" onClick={handleLogin}>
        Login
      </Button>

      {/* Link to signup */}
      <Box mt={2} textAlign="center">
        <Typography variant="body2">
          <a href="/signup" style={{ textDecoration: 'none' }}>
            Admin Sign Up
          </a>
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;
