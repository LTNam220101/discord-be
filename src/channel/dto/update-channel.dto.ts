import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateChannelDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  isPrivate: boolean;
}
