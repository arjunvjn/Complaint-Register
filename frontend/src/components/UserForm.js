import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  TextField,
  Typography,
  Button,
  Box
} from '@mui/material';
import axios from 'axios';
import Signup from '../pages/Signup';

const UserForm = ({isSignUp}) => {
  const { id } = useParams(); // id will be undefined in create mode
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: '',
    email_id: '',
    phone_number: '',
    password: ''
  });

  const isEdit = Boolean(id);

  // Load user details if in edit mode
  useEffect(() => {
    if (isEdit) {
        console.log(id)
        const AuthStr = 'Bearer '.concat(localStorage.getItem('token'));
      axios.get(`http://127.0.0.1:8000/user/get_user/${id}`, { headers: { Authorization: AuthStr }})
        .then(response => {console.log(response.data.data);setUser(response.data.data)})
        .catch(err => console.error('Failed to load user:', err));
    }
  }, [id, isEdit]);

  // Handle form changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = () => {
    const AuthStr = 'Bearer '.concat(localStorage.getItem('token'));
    if (isEdit) {
      axios.put(`http://127.0.0.1:8000/user/update_user/${id}`, user, { headers: { Authorization: AuthStr }})
        .then(() => {
          alert('User updated successfully!');
          navigate('/home');
        })
        .catch(err => console.error('Update failed:', err));
    }
    else {
      axios.post('http://127.0.0.1:8000/user/signup', user, { headers: { Authorization: AuthStr } })
        .then(() => {
          alert('User created successfully!');
          navigate('/home');
        })
        .catch(err => console.error('Creation failed:', err));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" mb={2}>
        {isEdit ? 'Edit User' : 'Create User'}
      </Typography>

      <TextField
        fullWidth
        label="Username"
        name="username"
        value={user.username}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Email"
        name="email_id"
        value={user.email_id}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Phone"
        name="phone_number"
        value={user.phone_number}
        onChange={handleChange}
        margin="normal"
      />
      {!isEdit && (
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={user.password}
          onChange={handleChange}
          margin="normal"
        />
      )}

      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {isEdit ? 'Update User' : 'Create User'}
        </Button>
      </Box>
    </Container>
  );
};

export default UserForm;
