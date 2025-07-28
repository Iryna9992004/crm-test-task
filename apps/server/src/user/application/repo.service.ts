import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { config } from 'shared/config';
import { RepoRepositoryMongo } from '../infrastructure/repos/repo.repository';
import { Repo } from '../domain/entities/repo.entity';
import { CreateRepoDto } from '../interface/dto/repo/create.dto';

@Injectable()
export class RepoService {
  private readonly logger = new Logger(RepoService.name);

  constructor(private readonly repoRepository: RepoRepositoryMongo) {}

  async fetchAndSaveGithubRepos(username: string, githubKey: string): Promise<Repo[]> {
    try {
      const url = `${config.github.api}/users/${username}/repos`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `token ${githubKey}`,
          Accept: 'application/vnd.github+json',
        },
      });
      
      const repos = response.data;
      const transformed: Repo[] = [];
      
      for (const repo of repos) {
        const entity = new Repo(
          repo.owner.login,
          repo.name,
          repo.stargazers_count,
          repo.forks_count,
          repo.open_issues_count,
          new Date(repo.created_at).toISOString(),
        );
        await this.repoRepository.save(entity);
        transformed.push(entity);
      }
      
      return transformed;
    } catch (error) {
      this.logger.error(`Failed to fetch repos for user ${username}:`, error.response?.data || error.message);
      throw new Error(`Failed to fetch repositories for user: ${username}`);
    }
  }

  async create({ projectOwner, name, description, isPrivate }: CreateRepoDto, githubKey: string): Promise<Repo | null> {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      this.logger.error('Repository name is required and must not be blank.');
      throw new Error('Repository name is required and must not be blank.');
    }
    const payload = {
      name: name.trim(),
      auto_init: true,
      description: description ?? '',
      private: isPrivate ?? false,
    };
    this.logger.debug(`Creating repo with payload: ${JSON.stringify(payload)}`);
    try {
      const response = await axios.post(
        `${config.github.api}/user/repos`,
        payload,
        {
          headers: {
            Authorization: `token ${githubKey}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
        }
      );
      const repo = response.data;
      const entity = new Repo(
        repo.owner?.login || projectOwner,
        repo.name,
        repo.stargazers_count || 0,
        repo.forks_count || 0,
        repo.open_issues_count || 0,
        new Date(repo.created_at).toISOString(),
      );
      await this.repoRepository.save(entity);
      this.logger.log(`Successfully created repository: ${repo.name}`);
      return entity;
    } catch (error) {
      this.logger.error(`Failed to create repository ${name}:`, error.response?.data || error.message);
      return null;
    }
  }

  async edit(
    projectOwner: string,
    name: string,
    updates: {
      name?: string;
      description?: string;
      private?: boolean;
      has_issues?: boolean;
      has_wiki?: boolean;
      has_projects?: boolean;
      default_branch?: string;
      archived?: boolean;
    },
    githubKey: string,
  ): Promise<Repo | null> {
    try {
      const payload = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      const response = await axios.patch(
        `${config.github.api}/repos/${projectOwner}/${name}`,
        payload,
        {
          headers: {
            Authorization: `token ${githubKey}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
        }
      );

      const repo = response.data;
      const entity = new Repo(
        repo.owner?.login || projectOwner,
        repo.name,
        repo.stargazers_count || 0,
        repo.forks_count || 0,
        repo.open_issues_count || 0,
        new Date(repo.created_at).toISOString(),
      );

      if (updates.name && updates.name !== name) {
        await this.repoRepository.deleteByName(name);
      }
      await this.repoRepository.save(entity);
      
      this.logger.log(`Successfully updated repository: ${name}`);
      return entity;
    } catch (error) {
      this.logger.error(`Failed to update repository ${name}:`, error.response?.data || error.message);
      return null;
    }
  }

  async delete(projectOwner: string, name: string, githubKey: string): Promise<boolean> {
    try {
      await axios.delete(
        `${config.github.api}/repos/${projectOwner}/${name}`,
        {
          headers: {
            Authorization: `token ${githubKey}`,
            Accept: 'application/vnd.github+json',
          },
        }
      );

      await this.repoRepository.deleteByName(name);
      this.logger.log(`Successfully deleted repository: ${name}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete repository ${name}:`, error.response?.data || error.message);
      return false;
    }
  }

  async getRepo(projectOwner: string, name: string, githubKey: string): Promise<Repo | null> {
    try {
      const response = await axios.get(
        `${config.github.api}/repos/${projectOwner}/${name}`,
        {
          headers: {
            Authorization: `token ${githubKey}`,
            Accept: 'application/vnd.github+json',
          },
        }
      );

      const repo = response.data;
      return new Repo(
        repo.owner.login,
        repo.name,
        repo.stargazers_count,
        repo.forks_count,
        repo.open_issues_count,
        new Date(repo.created_at).toISOString(),
      );
    } catch (error) {
      this.logger.error(`Failed to get repository ${name}:`, error.response?.data || error.message);
      return null;
    }
  }

  async archiveRepo(projectOwner: string, name: string, githubKey: string): Promise<boolean> {
    return !!(await this.edit(projectOwner, name, { archived: true }, githubKey));
  }

  async unarchiveRepo(projectOwner: string, name: string, githubKey: string): Promise<boolean> {
    return !!(await this.edit(projectOwner, name, { archived: false }, githubKey));
  }
}