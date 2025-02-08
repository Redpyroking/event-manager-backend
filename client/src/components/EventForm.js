import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EventForm({ user }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });
  const navigate = useNavigate();

  const { title, description, date } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/events',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate('/');
    } catch (error) {
      console.error('Error creating event', error.response.data);
    }
  };

  return (
    <div>
      <h2>Create Event</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Event Title"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Event Description"
            name="description"
            value={description}
            onChange={onChange}
          />
        </div>
        <div>
          <input
            type="datetime-local"
            name="date"
            value={date}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default EventForm;
