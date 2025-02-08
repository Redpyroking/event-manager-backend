import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditEventForm({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        const event = res.data;
        // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
        const formattedDate = new Date(event.date).toISOString().slice(0,16);
        setFormData({
          title: event.title,
          description: event.description,
          date: formattedDate,
        });
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };
    fetchEvent();
  }, [id]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/events/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating event:', error.response.data);
    }
  };

  return (
    <div>
      <h2>Edit Event</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Event Title"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <textarea
            placeholder="Event Description"
            name="description"
            value={formData.description}
            onChange={onChange}
          />
        </div>
        <div>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditEventForm;
