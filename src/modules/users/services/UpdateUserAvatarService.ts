import { getRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';
import User from '@modules/users/infra/typeorm/entities/User';
import upload from '@config/upload';
import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  file_name: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, file_name }: IRequest): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

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

    userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
