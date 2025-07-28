import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RepoService } from '../application/repo.service';
import { UserService } from '../application/user.service';
import { CreateRepoDto } from './dto/repo/create.dto';
import { EditRepoDto } from './dto/repo/edit.dto';
import { AuthGuard } from 'shared/guards/auth.guard';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('repo')
export class RepoController {
  constructor(
    private readonly repoService: RepoService,
    private readonly userService: UserService,
  ) {}

  @Get('/:username')
  async getGithubRepos(@Param('username') username: string, @Req() req: Request) {
    const user = await this.userService.findByEmail(req['user'].email);
    if (!user) {
      throw new Error('User not found');
    }
    const repos = await this.repoService.fetchAndSaveGithubRepos(username, user.githubKey);
    return repos;
  }

  @Post('/create')
  async create(@Body() body: CreateRepoDto, @Req() req: Request) {
    const user = await this.userService.findByEmail(req['user'].email);
    if (!user) {
      throw new Error('User not found');
    }
    const saved = await this.repoService.create(body, user.githubKey);
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
    @Req() req: Request,
  ) {
    const user = await this.userService.findByEmail(req['user'].email);
    if (!user) {
      throw new Error('User not found');
    }
    const updated = await this.repoService.edit(projectOwner, name, body, user.githubKey);
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
    @Req() req: Request,
  ) {
    const user = await this.userService.findByEmail(req['user'].email);
    if (!user) {
      throw new Error('User not found');
    }
    await this.repoService.delete(projectOwner, name, user.githubKey);
    return { message: 'Repo deleted' };
  }
}
