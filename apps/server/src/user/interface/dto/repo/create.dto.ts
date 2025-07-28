export class CreateRepoDto {
  projectOwner: string;
  name: string;
  description: string;
  isPrivate: boolean;
}