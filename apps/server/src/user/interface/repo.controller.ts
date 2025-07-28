import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { RepoService } from '../application/repo.service';
import { CreateRepoDto } from './dto/repo/create.dto';
import { EditRepoDto } from './dto/repo/edit.dto';
import { AuthGuard } from 'shared/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('repo')
export class RepoController {
  constructor(private readonly repoService: RepoService) {}

  @Get('/:username')
  async getGithubRepos(@Param('username') username: string) {
    const repos = await this.repoService.fetchAndSaveGithubRepos(username);
    return repos;
  }

  @Post('/create')
  async create(@Body() body: CreateRepoDto) {
    console.log('Received body:', body);
    const saved = await this.repoService.create(body);
    if (!saved) return { message: 'Error creating repo' };
    return {
      projectOwner: saved.projectOwner,
      name: saved.name,
      stars: saved.stars,
      forks: saved.forks,
      issues: saved.issues,
      dateTimeUTC: saved.dateTimeUTC,
    };
  }

  @Put('update/:projectOwner/:name')
  async edit(
    @Param('projectOwner') projectOwner: string,
    @Param('name') name: string,
    @Body() body: EditRepoDto,
  ) {
    const updated = await this.repoService.edit(projectOwner, name, body);
    if (!updated) return { message: 'Repo not found' };
    return {
      projectOwner: updated.projectOwner,
      name: updated.name,
      stars: updated.stars,
      forks: updated.forks,
      issues: updated.issues,
      dateTimeUTC: updated.dateTimeUTC,
    };
  }

  @Delete(':projectOwner/:name')
  async delete(
    @Param('projectOwner') projectOwner: string,
    @Param('name') name: string,
  ) {
    await this.repoService.delete(projectOwner, name);
    return { message: 'Repo deleted' };
  }
}
