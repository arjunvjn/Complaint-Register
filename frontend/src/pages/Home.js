import React, {useState} from 'react';
import { Container, Typography, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CardRow from '../components/CardRow';
import UserTable from '../components/UserTable';
import ComplaintTable from '../components/ComplaintTable';
import axios from 'axios';

function Home() {
  const navigate = useNavigate();

  const [statusUpdated, setStatusUpdated] = useState(false);

  const handleLogout = () => {
    // Clear tokens or auth state if needed
    const AuthStr = 'Bearer '.concat(localStorage.getItem('token'));
    axios.post('http://127.0.0.1:8000/user/logout', {
      refresh: localStorage.getItem('refresh_token')
    },
    { headers: { Authorization: AuthStr } }).then((res)=>
      console.log(res)
    ).catch((err)=>console.log(err))
    localStorage.removeItem('token')
    localStorage.removeItem('is_admin')
    localStorage.removeItem('refresh_token')
    navigate('/');
  };

  const handleCreateUser = () => {
    // alert('Create User form goes here!');
    navigate('/create-user');
  };

  const handleCreateComplaint = () => {
    // alert('Create Complaint form goes here!');
    navigate('/create-complaint')
  };

  return (
    <Container style={{ marginTop: '20px' }}>
      {/* Header with Logout */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h4">Dashboard</Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Stack>

      {/* Create buttons */}
      { localStorage.getItem('is_admin') && <Stack direction="row" spacing={2} marginBottom={3}>
        <Button variant="contained" color="primary" onClick={handleCreateUser}>
          Create User
        </Button>
        <Button variant="contained" color="primary" onClick={handleCreateComplaint}>
          Create Complaint
        </Button>
      </Stack>}

      {/* Page Content */}
      <CardRow statusUpdated={statusUpdated} setStatusUpdated={setStatusUpdated} />
      {localStorage.getItem('is_admin') && <UserTable />}
      <ComplaintTable statusUpdated={statusUpdated} setStatusUpdated={setStatusUpdated} />
    </Container>
  );
}

export default Home;
