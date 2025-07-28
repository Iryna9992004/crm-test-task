export class EditRepoDto {
  name?: string;
  description?: string;
  private?: boolean;
  has_issues?: boolean;
  has_wiki?: boolean;
  has_projects?: boolean;
  default_branch?: string;
  archived?: boolean;
}
