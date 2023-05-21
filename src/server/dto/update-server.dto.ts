import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateServerDto {
  @IsNotEmpty()
  @IsString()
  serverId: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isPublic: boolean;
}
