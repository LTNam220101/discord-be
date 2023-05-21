import { IsString, IsNotEmpty, IsBoolean, IsEnum } from 'class-validator';
import { Types } from 'src/schema/channel.schema';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  serverId: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  isPrivate: boolean;

  @IsNotEmpty()
  @IsEnum(Types)
  type: Types;
}
