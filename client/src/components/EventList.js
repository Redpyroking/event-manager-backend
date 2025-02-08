import React from 'react';
import EventItem from './EventItem';

function EventList({ events,onDelete }) {
  return (
    <div>
      <h2>Upcoming Events</h2>
      {events && events.length > 0 ? (
        events.map((event) => (
          <EventItem key={event._id} event={event} onDelete={onDelete}/>
        ))
      ) : (
        <p>No events available.</p>
      )}
    </div>
  );
}

export default EventList;
