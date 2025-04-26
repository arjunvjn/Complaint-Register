import React, { useState, useEffect } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Typography,
  Box
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Dummy data for dropdowns
const complaintLevels = ['Low', 'Medium', 'High'];
// const usersList = ['User1', 'User2', 'User3']; // Replace with dynamic fetch if needed


const ComplaintForm = () => {
  const { complaintId } = useParams(); // If `complaintId` exists, it's edit mode
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    complaint: '',
    complaintLevel: '',
    assignedTo: '',
  });

  useEffect(()=> {
    const AuthStr = 'Bearer '.concat(localStorage.getItem('token'));
    axios.get('http://127.0.0.1:8000/user/',
      { headers: { Authorization: AuthStr } }
    ) // Replace with your backend URL
      .then(response => {
        setUsersList(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  },[])

  useEffect(() => {
    if (complaintId) {
      // Fetch the complaint from backend by ID
      // Simulate with dummy data for now
    //   const fetchedData = {
    //     customerName: 'John Doe',
    //     customerPhone: '1234567890',
    //     complaint: 'Received wrong product.',
    //     complaintLevel: 'High',
    //     assignedTo: 'User2',
    //   };
    //   setFormData(fetchedData);
    console.log(complaintId)
    const AuthStr = 'Bearer '.concat(localStorage.getItem('token'));
      axios.get(`http://127.0.0.1:8000/complaint/get_complaint/${complaintId}`,{ headers: { Authorization: AuthStr } })
        .then(response => {
            console.log(response.data.data);
            const fetchedData = {
                    customerName: response.data.data.username,
                    customerPhone: response.data.data.user_phone,
                    complaint: response.data.data.complaint_note,
                    complaintLevel: response.data.data.level,
                    assignedTo: response.data.data.assigned_user.id,
                  };
                  setFormData(fetchedData);
         })
        .catch(err => console.error('Failed to load user:', err));
    }
  }, [complaintId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (complaintId) {
      console.log('Updating complaint:', formData);
      const AuthStr = 'Bearer '.concat(localStorage.getItem('token'));
      axios.put(`http://127.0.0.1:8000/complaint/update_complaint/${complaintId}`,{
        assigned_user: formData.assignedTo,
        username:formData.customerName,
        user_phone:formData.customerPhone,
        complaint_note:formData.complaint,
        level:formData.complaintLevel
      },{ headers: { Authorization: AuthStr } }).then((res)=>{
        console.log(res)
        navigate('/home');
      }).catch((err)=>console.log(err))
      // API call to update
    } else {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      const date = dd + '-' + mm + '-' + yyyy
      console.log(date)
      console.log('Creating new complaint:', formData);
      const AuthStr = 'Bearer '.concat(localStorage.getItem('token'));
      axios.post('http://127.0.0.1:8000/complaint/create_complaint',{
        assigned_user: formData.assignedTo,
        date: date,
        username:formData.customerName,
        user_phone:formData.customerPhone,
        complaint_note:formData.complaint,
        level:formData.complaintLevel
      },{ headers: { Authorization: AuthStr } }).then((res)=>{
        console.log(res)
        navigate('/home');
      }).catch((err)=>console.log(err))
      // API call to create
    }
    // navigate('/complaints'); // redirect after submission
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, margin: 'auto', padding: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="h5">
        {complaintId ? 'Edit Complaint' : 'Create Complaint'}
      </Typography>

      <TextField
        label="Customer Name"
        name="customerName"
        value={formData.customerName}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="Customer Phone Number"
        name="customerPhone"
        value={formData.customerPhone}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="Complaint"
        name="complaint"
        value={formData.complaint}
        onChange={handleChange}
        multiline
        rows={4}
        required
        fullWidth
      />

      <TextField
        select
        label="Complaint Level"
        name="complaintLevel"
        value={formData.complaintLevel}
        onChange={handleChange}
        required
        fullWidth
      >
        {complaintLevels.map(level => (
          <MenuItem key={level} value={level}>
            {level}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Assigned To"
        name="assignedTo"
        value={formData.assignedTo}
        onChange={handleChange}
        required
        fullWidth
      >
        {usersList.map(user => (
          <MenuItem key={user} value={user.id}>
            {user.username}
          </MenuItem>
        ))}
      </TextField>

      <Button variant="contained" type="submit">
        {complaintId ? 'Update Complaint' : 'Create Complaint'}
      </Button>
    </Box>
  );
};

export default ComplaintForm;
