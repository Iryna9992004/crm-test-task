import React from 'react';
import { useForm } from 'react-hook-form';
import type { RepoData } from '../../entities/repo/Repo';

interface EditRepoFormProps {
  initialData: Partial<Omit<RepoData, 'projectOwner' | 'dateTimeUTC'>>;
  onSubmit: (data: Partial<Omit<RepoData, 'projectOwner' | 'dateTimeUTC'>>) => void;
  onCancel: () => void;
}

const EditRepoForm: React.FC<EditRepoFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Partial<Omit<RepoData, 'projectOwner' | 'dateTimeUTC'>>>({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ background: '#fff', padding: '1rem', borderRadius: 8, boxShadow: '0 2px 8px rgba(60,60,60,0.04)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>Name</label>
        <input {...register('name', { required: 'Name is required' })} />
        {errors.name && <div style={{ color: 'red' }}>{errors.name?.message as string}</div>}
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit" disabled={isSubmitting} style={{ background: '#60a5fa', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1rem' }}>Save</button>
        <button type="button" onClick={onCancel} style={{ background: '#e5e7eb', color: '#333', border: 'none', borderRadius: 4, padding: '0.5rem 1rem' }}>Cancel</button>
      </div>
    </form>
  );
};

export default EditRepoForm;
