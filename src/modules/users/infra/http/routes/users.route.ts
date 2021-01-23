import { Router } from 'express';
import multer from 'multer';
import { container } from 'tsyringe';

import uploadConfig from '@config/upload';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UsersRepository from '../../typeorm/repositories/UsersRepository';

const userRouter = Router();

const upload = multer(uploadConfig);

userRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const usersRepository = new UsersRepository();
  const createUser = new CreateUserService(usersRepository);

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  user.password = '';

  return res.json(user);
});

userRouter.patch(
  '/avatar',
  upload.single('avatar'),
  ensureAuthenticated,
  async (req, res) => {
    const updateAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateAvatar.execute({
      user_id: req.user.id,
      file_name: req.file.filename,
    });

    user.password = '';

    return res.json(user);
  },
);

export default userRouter;
