import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EventList from './EventList';
import './Dashboard.css';

function Dashboard({ events, user, setEvents }) {
  const [searchTerm, setSearchTerm] = useState('');
  console.log(user,"<--");
  // Filter events based on search term (case-insensitive)
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Callback to update events when one is deleted
  const handleDelete = (id) => {
    setEvents(prevEvents => prevEvents.filter(event => event._id !== id));
  };

  return (
    <div className='dashboard'>
      <div className='dashboard-header'>
      <h1>Event Dashboard</h1>
      <p>Welcome, {user.email}</p>
      <div className='dashboard-create'>
      <Link to="/create-event">Add New Event +</Link>
      </div>
      </div>

      <div className='search-container'>
        <input 
          type="text"
          placeholder="Search Events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <EventList events={filteredEvents} onDelete={handleDelete} />
    </div>
  );
}

export default Dashboard;
