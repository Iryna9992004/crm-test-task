import { Repo } from '../entities/repo.entity';

export interface IRepoRepository {
  getAllByUsername(username: string): Promise<Repo[]>;
  save(repo: Repo): Promise<Repo>;
  deleteByName(name: string): Promise<void>;
} 