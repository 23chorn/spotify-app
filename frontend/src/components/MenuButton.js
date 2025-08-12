import React from 'react';

const MenuButton = ({ title, description, onClick, disabled }) => {
  const baseStyle = {
    padding: '1.5rem',
    backgroundColor: 'transparent',
    border: '2px solid #1DB954',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    userSelect: 'none',
    outline: 'none',
    width: '100%',
    position: 'relative',
    overflow: 'hidden'
  };

  const titleStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1DB954',
    zIndex: 1,
    transition: 'color 0.2s ease'
  };

  const descriptionStyle = {
    fontSize: '0.9rem',
    color: '#666',
    zIndex: 1,
    transition: 'color 0.2s ease'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={baseStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#1DB954';
        e.currentTarget.querySelector('.title').style.color = 'white';
        e.currentTarget.querySelector('.description').style.color = 'white';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.querySelector('.title').style.color = '#1DB954';
        e.currentTarget.querySelector('.description').style.color = '#666';
      }}
    >
      <span className="title" style={titleStyle}>{title}</span>
      <span className="description" style={descriptionStyle}>{description}</span>
    </button>
  );
};

export default MenuButton;