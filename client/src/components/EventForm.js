import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EventForm({ user }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const { title, description, date } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      // If an image is selected, upload it to Cloudinary
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);
        const uploadRes = await axios.post('http://localhost:5000/api/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.url;
      }

      // Include imageUrl in event data if needed
      const eventData = { ...formData, imageUrl };

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/events', eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (error) {
      console.error('Error creating event', error.response ? error.response.data : error.message);
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
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default EventForm;
