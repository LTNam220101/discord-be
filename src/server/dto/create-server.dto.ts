import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateServerDto {
  @IsNotEmpty()
  @IsString()
  ownerId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;
}
