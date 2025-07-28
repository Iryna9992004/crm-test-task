import React, { useEffect, useState, useContext } from 'react';
import Repo from '../../entities/repo/Repo';
import { useRepos } from '../../hooks/repos/useRepos';
import { useEditRepo } from '../../hooks/repos/useEditRepo';
import { useDeleteRepo } from '../../hooks/repos/useDeleteRepo';
import { useAddRepo } from '../../hooks/repos/useAddRepo';
import { UserContext } from '../../providers/UserProvider';
import EditRepoForm from '../../features/edit-repo-form/EditRepoForm';
import CreateRepoForm from '../../features/create-repo-form/CreateRepoForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Repos: React.FC = () => {
  const fetchRepos = useRepos();
  const editRepo = useEditRepo();
  const deleteRepo = useDeleteRepo();
  const addRepo = useAddRepo();
  const { user, setUser } = useContext(UserContext);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRepo, setEditingRepo] = useState<any | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const navigate = useNavigate();

  const refetchRepos = () => {
    if (!user?.username) {
      navigate('/');
      return;
    }
    setLoading(true);
    fetchRepos(user.username)
      .then(setRepos)
      .catch((err) => setError(err?.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refetchRepos();
  }, [user?.username]);

  const handleEdit = (repo: any) => {
    setEditingRepo(repo);
  };

  const handleEditSubmit = async (data: any) => {
    if (!editingRepo) return;
    try {
      await editRepo(editingRepo.projectOwner, editingRepo.name, data);
      setEditingRepo(null);
      refetchRepos();
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (repo: any) => {
    if (!window.confirm(`Delete repo ${repo.name}?`)) return;
    try {
      await deleteRepo(repo.projectOwner, repo.name);
      refetchRepos();
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${BASE_URL}/auth/logout`, { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (err: any) {
      alert('Logout failed');
    }
  };

  const handleCreate = async (data: any) => {
    try {
      await addRepo(data);
      setShowCreateForm(false);
      refetchRepos();
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <h2>Your Repositories</h2>
        <div style={{ display: 'flex', gap: '0.5rem', width: '50vw' }}>
          <button onClick={() => setShowCreateForm((v) => !v)} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1rem', cursor: 'pointer' }}>
            {showCreateForm ? 'Close' : 'Add Repo'}
          </button>
          <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1rem', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>
      {showCreateForm && (
        <CreateRepoForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
      {editingRepo && (
        <EditRepoForm
          initialData={editingRepo}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingRepo(null)}
        />
      )}
      {repos.length === 0 ? (
        <div>No repositories found.</div>
      ) : (
        repos.map((repo) => (
          <Repo
            key={repo.name}
            projectOwner={repo.projectOwner}
            name={repo.name}
            stars={repo.stars}
            forks={repo.forks}
            issues={repo.issues}
            dateTimeUTC={repo.dateTimeUTC}
            onEdit={() => handleEdit(repo)}
            onDelete={() => handleDelete(repo)}
          />
        ))
      )}
    </div>
  );
};

export default Repos;
