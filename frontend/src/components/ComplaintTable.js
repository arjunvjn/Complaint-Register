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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  styled,
  Tooltip
} from '@mui/material';

const ComplaintTable = ({statusUpdated, setStatusUpdated}) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [open, setOpen] = useState(false); // Modal open state
  const [review, setReview] = useState(''); // Review text state
  const [complaintId, setComplaintId] = useState();
  const [complaintIds, setComplaintIds] = useState([]);
  const [review_obj, setReview_obj] = useState({});

  const complaintStatus = {'Assigned': 'Processing', 'Processing': 'Completed'}

  const navigate = useNavigate();

  // Fetch user data when component mounts
  useEffect(() => {
    const AuthStr = 'Bearer '.concat(localStorage.getItem('token'));
    axios.get('http://127.0.0.1:8000/complaint/get_complaints',
      { headers: { Authorization: AuthStr } }
    ) // Replace with your backend URL
      .then(response => {
        setComplaints(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching complaints:', error);
        setLoading(false);
      });
    axios.get('http://127.0.0.1:8000/complaint/get_reviews',
      { headers: { Authorization: AuthStr } }
    ) // Replace with your backend URL
      .then(response => {
        console.log(response.data);
        setComplaintIds(response.data.complaint_ids)
        setReview_obj(response.data.review_obj)
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching complaints:', error);
        setLoading(false);
      });
  }, [statusUpdated]);

  // Handle opening the modal
  const handleReview = (id) => {
    setComplaintId(id)
    if (complaintIds.includes(id))
      setReview(review_obj[id])
    setOpen(true);
  };

  // Handle closing the modal
  const handleClose = () => {
    setOpen(false);
  };

  // Handle review text change
  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  // Handle form submit (could send to backend here)
  const handleSubmit = () => {
    console.log('Review submitted:', review);
    const AuthStr = 'Bearer '.concat(localStorage.getItem('token'));
    if(complaintIds.includes(complaintId)) {
      axios.put(`http://127.0.0.1:8000/complaint/update_review/${complaintId}`, {
        review_note: review,
        complaint: complaintId
      }, { headers: { Authorization: AuthStr } }).then((res) => {
        console.log(res)
        setStatusUpdated(!statusUpdated)
        handleClose(); // Close modal after submission
      }).catch((err) => console.log(err))
    }else{
      axios.post('http://127.0.0.1:8000/complaint/create_review', {
        review_note: review,
        complaint: complaintId
      }, { headers: { Authorization: AuthStr } }).then((res) => {
        console.log(res)
        setStatusUpdated(!statusUpdated)
        handleClose(); // Close modal after submission
      }).catch((err) => console.log(err))
    }
  };

  const handleEdit = (id) => {
    // alert(`Edit user with ID: ${id}`);
    // You can open a modal or navigate to edit user page
    // localStorage.setItem('id', id)
    navigate(`/edit-complaint/${id}`);
  };

  const handleUpdate = (id) => {
    const AuthStr = 'Bearer '.concat(localStorage.getItem('token'));
    axios.patch(`http://127.0.0.1:8000/complaint/update_status/${id}`, {}, { headers: { Authorization: AuthStr } })
      .then((res) => {
        console.log(res);
        // window.location.reload()
        setStatusUpdated(!statusUpdated)

      }).catch((err) => console.log(err))
  }

  if (loading) {
    return (
      <TableContainer component={Paper} sx={{ backgroundColor: '#46515A', color: '#fff', padding: 3 }}>
        <Typography sx={{ color: '#fff' }}>Loading Complaints...</Typography>
        <CircularProgress color="inherit" />
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: '#46515A', color: '#fff', marginBottom: '20px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#fff' }}>Date</TableCell>
            <TableCell sx={{ color: '#fff' }}>Complaint Id</TableCell>
            <TableCell sx={{ color: '#fff' }}>Client Name</TableCell>
            <TableCell sx={{ color: '#fff' }}>Client Phone</TableCell>
            <TableCell sx={{ color: '#fff' }}>Assigned User</TableCell>
            <TableCell sx={{ color: '#fff' }}>Level</TableCell>
            <TableCell sx={{ color: '#fff' }}>Status</TableCell>
            <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {complaints.map((complaint) => (
            <TableRow key={complaint.id}>
              <TableCell sx={{ color: '#fff' }}>{complaint.date}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{complaint.id}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{complaint.username}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{complaint.user_phone}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{complaint.assigned_user.username}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{complaint.level}</TableCell>
              <TableCell sx={{ color: '#fff' }}>{complaint.status}</TableCell>
              <TableCell>
                {localStorage.getItem('is_admin') && <Button
                  variant="outlined"
                  size="small"
                  sx={{ color: '#fff', borderColor: '#fff', marginRight: 1 }}
                  onClick={() => handleEdit(complaint.id)}
                >
                  Edit
                </Button>}
                {!localStorage.getItem('is_admin') &&
                  <> {complaint.status !== 'Completed' ?
                    <Tooltip
                      title= {'set status to '+ complaintStatus[complaint.status]}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ borderColor: '#fff', color: '#fff' }}
                        onClick={() => handleUpdate(complaint.id)}
                      >
                        Update Status
                      </Button></Tooltip> :
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ borderColor: '#fff', color: '#fff' }}
                      onClick={() => handleReview(complaint.id)}
                    >
                      Write Review
                    </Button>
                  }
                  </>
                }
                {localStorage.getItem('is_admin') && complaintIds.includes(complaint.id) &&
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ borderColor: '#fff', color: '#fff' }}
                    onClick={() => handleReview(complaint.id)}
                  >
                    View Review
                  </Button>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Review Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        {localStorage.getItem('is_admin') ? <DialogTitle>Review</DialogTitle>:<DialogTitle>Write a Review</DialogTitle>}
        <DialogContent>
          {!localStorage.getItem('is_admin') && <Typography variant="body2" color="textSecondary" gutterBottom>
            Please share your feedback with us:
          </Typography>}
          <TextField
            label={!localStorage.getItem('is_admin') && "Your Review"}
            variant="outlined"
            fullWidth
            multiline

            disabled={localStorage.getItem('is_admin') ? true : false}
            rows={4}
            value={review}
            onChange={handleReviewChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" sx={{ display: localStorage.getItem('is_admin') ? 'none' : 'block' }}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default ComplaintTable;
