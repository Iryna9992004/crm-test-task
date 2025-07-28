import React, { useEffect, useState, useContext } from 'react';
import Repo from '../../entities/repo/Repo';
import { useRepos } from '../../hooks/repos/useRepos';
import { useEditRepo } from '../../hooks/repos/useEditRepo';
import { useDeleteRepo } from '../../hooks/repos/useDeleteRepo';
import { UserContext } from '../../providers/UserProvider';
import EditRepoForm from '../../features/edit-repo-form/EditRepoForm';

const Repos: React.FC = () => {
  const fetchRepos = useRepos();
  const editRepo = useEditRepo();
  const deleteRepo = useDeleteRepo();
  const { user } = useContext(UserContext);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRepo, setEditingRepo] = useState<any | null>(null);

  const refetchRepos = () => {
    if (!user?.username) return;
    setLoading(true);
    fetchRepos(user.username)
      .then(setRepos)
      .catch((err) => setError(err?.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refetchRepos();
    // eslint-disable-next-line
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Your Repositories</h2>
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
