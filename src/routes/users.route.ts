import { Router } from 'express';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const userRouter = Router();
const upload = multer(uploadConfig);

userRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const createUser = new CreateUserService();

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
    const updateAvatar = new UpdateUserAvatarService();

    const user = await updateAvatar.execute({
      user_id: req.user.id,
      file_name: req.file.filename,
    });

    user.password = '';

    return res.json(user);
  },
);

export default userRouter;
