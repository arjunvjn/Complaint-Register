import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import UserForm from './components/UserForm';
import ComplaintForm from './components/ComplaintForm';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/create-user" element={<UserForm isSignUp={false} />} />
      <Route path="/edit-user/:id" element={<UserForm isSignUp={false} />} />
      <Route path="/create-complaint" element={<ComplaintForm />} />
      <Route path="/edit-complaint/:complaintId" element={<ComplaintForm />} />
    </Routes>
  );
}

export default App;
