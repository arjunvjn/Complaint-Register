import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('token'))
      navigate('/home')
  },[])
  

  // State for form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Handler for signup
  const handleSignup = async() => {
    if (username && email && phone && password) {
    //   console.log('User registered:', {
    //     username,
    //     email,
    //     phone,
    //     password
    //   });

    //   // Navigate to login page (or home/dashboard if you prefer)
    //   navigate('/');
    await axios.post('http://127.0.0.1:8000/user/signup',{
        username: username,
        phone_number:phone,
        email_id:email,
        password:password,
        is_admin: true
    }).then((res)=>{console.log(res); navigate('/')}).catch((err)=>console.log(err))
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '50px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Sign Up
      </Typography>

      <TextField
        fullWidth
        label="Username"
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        label="Email"
        type="email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        fullWidth
        label="Phone Number"
        margin="normal"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSignup}
        sx={{ mt: 2 }}
      >
        Sign Up
      </Button>

      <Box mt={2} textAlign="center">
        <Typography variant="body2">
          Already have an account?{' '}
          <a href="/" style={{ textDecoration: 'none' }}>
            Login
          </a>
        </Typography>
      </Box>
    </Container>
  );
}

export default Signup;
