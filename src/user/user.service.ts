import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userRepo: Model<User>,
  ) {}

  async findOneById(id: number) {
    return await this.userRepo.findById(id);
  }

  async findOneByUsername(username: string) {
    return await this.userRepo.findOne({
      username: username,
    });
  }

  async createNewUser(data: any) {
    return await this.userRepo.create(data);
  }

  async updateUser(id: number, data: any) {
    const res = await this.userRepo.findByIdAndUpdate(id, data);
    return res;
  }
}
