import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRepoRepository } from 'src/user/domain/repos/repo.repository';
import { RepoSchemaClass } from '../schemas/user.schema';
import { Repo } from 'src/user/domain/entities/repo.entity';

@Injectable()
export class RepoRepositoryMongo implements IRepoRepository {
  constructor(@InjectModel(RepoSchemaClass.name) private readonly model: Model<RepoSchemaClass>) {}

  async getAllByUsername(username: string): Promise<Repo[]> {
    const docs = await this.model.find({ projectOwner: username });
    return docs.map(this.toDomain);
  }

  async save(repo: Repo): Promise<Repo> {
    const plain = {
      projectOwner: repo.projectOwner,
      name: repo.name,
      stars: repo.stars,
      forks: repo.forks,
      issues: repo.issues,
      dateTimeUTC: repo.dateTimeUTC,
    };
    const doc = await this.model.findOneAndUpdate(
      { projectOwner: repo.projectOwner, name: repo.name },
      plain,
      { new: true, upsert: true }
    );
    return this.toDomain(doc);
  }

  async deleteByName(name: string): Promise<void> {
    await this.model.deleteOne({ name });
  }

  private toDomain(doc: any): Repo {
    return new Repo(
      doc.projectOwner,
      doc.name,
      doc.stars,
      doc.forks,
      doc.issues,
      doc.dateTimeUTC,
    );
  }
} 