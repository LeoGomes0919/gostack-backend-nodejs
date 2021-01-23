import fs from 'fs';
import path from 'path';
import { inject, injectable } from 'tsyringe';

import upload from '@config/upload';
import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  file_name: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, file_name }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Apenas usuários autenticados podem alterar o avatar.',
        401,
      );
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(upload.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = file_name;

    this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
