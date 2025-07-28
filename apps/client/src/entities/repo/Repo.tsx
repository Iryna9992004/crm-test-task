import React from 'react';

export interface RepoProps {
  projectOwner: string;
  name: string;
  stars: number;
  forks: number;
  issues: number;
  dateTimeUTC: string;
  onEdit: () => void;
  onDelete: () => void;
}

const Repo: React.FC<RepoProps> = ({ projectOwner, name, stars, forks, issues, dateTimeUTC, onEdit, onDelete }) => {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: '1rem',
      marginBottom: '1rem',
      background: '#fff',
      boxShadow: '0 2px 8px rgba(60,60,60,0.04)'
    }}>
      <h3 style={{ margin: 0, color: 'black' }}>{name}</h3>
      <p style={{ margin: '0.5rem 0 0.25rem 0', color: '#555' }}>Owner: {projectOwner}</p>
      <div style={{ display: 'flex', gap: '1.5rem', margin: '0.5rem 0' }}>
        <span style={{ margin: 0, color: 'black' }}>⭐ {stars}</span>
        <span style={{ margin: 0, color: 'black' }}>🍴 {forks}</span>
        <span style={{ margin: 0, color: 'black' }}>🐞 {issues}</span>
      </div>
      <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.75rem' }}>Last updated: {new Date(dateTimeUTC).toLocaleString()}</div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={onEdit} style={{ padding: '0.5rem 1rem', background: '#60a5fa', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Edit</button>
        <button onClick={onDelete} style={{ padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
      </div>
    </div>
  );
};

export default Repo;
