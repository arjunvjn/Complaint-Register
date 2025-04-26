import React, {useEffect, useState} from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';

const CardRow = ({statusUpdated, setStatusUpdated}) =>{ 
  const [complaintCount, setComplaintCount] = useState({});
  useEffect(()=>{
    const AuthStr = 'Bearer '.concat(localStorage.getItem('token'));
    axios.get('http://127.0.0.1:8000/complaint/get_count',
      { headers: { Authorization: AuthStr } }
    ) // Replace with your backend URL
      .then(response => {
        console.log(response.data);
        let com_count = {
          Assigned: response.data.assigned,
          Processing: response.data.pending,
          Completed: response.data.completed
        }
        setComplaintCount(com_count)
      })
      .catch(error => {
        console.error('Error fetching complaints:', error);
      });
  },[statusUpdated])
  return(
  <Grid container spacing={2} marginBottom={2}>
    {['Assigned', 'Processing', 'Completed'].map((item) => (
      <Grid item xs={12} md={4} key={item}>
        <Card sx={{ backgroundColor: '#46515A', color: '#fff' }}>
          <CardContent>
            <Typography variant="h6">{item}</Typography>
            <Typography>{complaintCount[item]}</Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);
}

export default CardRow;
