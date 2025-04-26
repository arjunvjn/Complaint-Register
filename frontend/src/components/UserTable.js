import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  TableContainer,
  CircularProgress,
  Typography
} from '@mui/material';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUserDeleted, setIsUserDeleted] = useState(false);

  const navigate = useNavigate();

  // Fetch user data when component mounts
  useEffect(() => {
    const AuthStr = 'Bearer '.concat(localStorage.getItem('token'));
    axios.get('http://127.0.0.1:8000/user/',
      { headers: { Authorization: AuthStr } }
    ) // Replace with your backend URL
      .then(response => {
        setUsers(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, [isUserDeleted]);

  const handleEdit = (id) => {
    // alert(`Edit user with ID: ${id}`);
    // You can open a modal or navigate to edit user page
    // localStorage.setItem('id', id)
    navigate(`/edit-user/${id}`);
  };

  const handleDelete = (id) => {
    // alert(`Delete user with ID: ${id}`);
    // Implement delete API call here
    const AuthStr = 'Bearer '.concat(localStorage.getItem('token'));
    axios.delete(`http://127.0.0.1:8000/user/delete_user/${id}`,{ headers: { Authorization: AuthStr } })
    .then((res)=>{
      console.log(res)
      setIsUserDeleted(!isUserDeleted)
    }).catch((err)=>console.log(err))
  };

  if (loading) {
    return (
      <TableContainer component={Paper} sx={{ backgroundColor: '#46515A', color: '#fff', padding: 3 }}>
        <Typography sx={{ color: '#fff' }}>Loading Users...</Typography>
        <CircularProgress color="inherit" />
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: '#46515A', color: '#fff', marginBottom: '20px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#fff' }}>Username</TableCell>
            <TableCell sx={{ color: '#fff' }}>Email</TableCell>
            <TableCell sx={{ color: '#fff' }}>Phone</TableCell>
            <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell sx={{ color: '#fff' }}>{user.username}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{user.email_id}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{user.phone_number}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ color: '#fff', borderColor: '#fff', marginRight: 1 }}
                  onClick={() => handleEdit(user.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  sx={{ borderColor: '#fff', color: '#fff' }}
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
