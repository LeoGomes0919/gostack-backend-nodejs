import AppError from '@shared/errors/AppError';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

describe('AuthenticateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakeRepository,
      fakeHashProvider,
    );
    const createUserService = new CreateUserService(
      fakeRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      name: 'Leonardo',
      email: 'leonardo@gmail.com',
      password: '1234',
    });

    const response = await authenticateUser.execute({
      email: 'leonardo@gmail.com',
      password: '1234',
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with non existing user', async () => {
    const fakeRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakeRepository,
      fakeHashProvider,
    );

    expect(
      authenticateUser.execute({
        email: 'leo@gmail.com',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with incorrect password', async () => {
    const fakeRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakeRepository,
      fakeHashProvider,
    );

    const createUserService = new CreateUserService(
      fakeRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      name: 'Leonardo',
      email: 'leonardo@gmail.com',
      password: '1234',
    });

    expect(
      authenticateUser.execute({
        email: 'leonardo@gmail.com',
        password: '12345',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
