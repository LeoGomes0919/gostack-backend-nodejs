import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

describe('UpdateUserAvatar', () => {
  it('should be able to update user avatar', async () => {
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserServce = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await createUserServce.execute({
      name: 'John Doe',
      email: 'jonndoe@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      file_name: 'avatar.png',
    });

    expect(user.avatar).toBe('avatar.png');
  });

  it('should not be able to update the user avatar if not logged in', async () => {
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUsersRepository = new FakeUsersRepository();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatar.execute({
        user_id: '12345678',
        file_name: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updatinh new one', async () => {
    const fakeStorageProvider = new FakeStorageProvider();
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const createUserServce = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await createUserServce.execute({
      name: 'John Doe',
      email: 'jonndoe@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      file_name: 'avatar.png',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      file_name: 'avatar2.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.png');
    expect(user.avatar).toBe('avatar2.png');
  });
});
