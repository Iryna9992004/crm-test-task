import React, { useEffect, useState, useContext } from 'react';
import Repo from '../../entities/repo/Repo';
import { useRepos } from '../../hooks/repos/useRepos';
import { UserContext } from '../../providers/UserProvider';

const Repos: React.FC = () => {
  const fetchRepos = useRepos();
  const { user } = useContext(UserContext);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.username) return;
    setLoading(true);
    fetchRepos(user.username)
      .then(setRepos)
      .catch((err) => setError(err?.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [user?.username]);

  const handleEdit = (repo: any) => {
    // TODO: Implement edit logic
    alert(`Edit repo: ${repo.name}`);
  };

  const handleDelete = (repo: any) => {
    // TODO: Implement delete logic
    alert(`Delete repo: ${repo.name}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto' }}>
      <h2>Your Repositories</h2>
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
