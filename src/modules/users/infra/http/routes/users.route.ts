import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UpdateUserAvatarController from '@modules/users/infra/http/controllers/UpdateUserAvatarController';

const userRouter = Router();
const usersController = new UsersController();
const updateUserAvatarController = new UpdateUserAvatarController();

const upload = multer(uploadConfig);

userRouter.post('/', usersController.create);

userRouter.patch(
  '/avatar',
  upload.single('avatar'),
  ensureAuthenticated,
  updateUserAvatarController.update,
);

export default userRouter;
