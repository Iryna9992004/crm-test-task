import React from 'react';
import { useForm } from 'react-hook-form';

interface CreateRepoFormProps {
  onSubmit: (data: { name: string }) => void;
  onCancel: () => void;
}

const CreateRepoForm: React.FC<CreateRepoFormProps> = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ name: string }>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ background: '#fff', padding: '1rem', borderRadius: 8, boxShadow: '0 2px 8px rgba(60,60,60,0.04)', marginBottom: '1rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>Name</label>
        <input {...register('name', { required: 'Name is required' })} />
        {errors.name && <div style={{ color: 'red' }}>{errors.name?.message as string}</div>}
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="submit" disabled={isSubmitting} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1rem' }}>Add</button>
        <button type="button" onClick={onCancel} style={{ background: '#e5e7eb', color: '#333', border: 'none', borderRadius: 4, padding: '0.5rem 1rem' }}>Cancel</button>
      </div>
    </form>
  );
};

export default CreateRepoForm;
