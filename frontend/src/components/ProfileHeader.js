import React from 'react';

const ProfileHeader = ({ profile }) => {
  if (!profile) return null;

  return (
    <div style={{
      backgroundColor: '#282828',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '2rem'
    }}>
      <h2 style={{ margin: 0 }}>
        Welcome, {profile.display_name}
      </h2>
    </div>
  );
};

export default ProfileHeader;