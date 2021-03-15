import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRole } from './user-roles.enum';
import { NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { FindUsersQueryDto } from './dtos/find-users-query.dto';

/**
 * Será reponsável por simular todas as chamadas ao userRepository dentro do
 * users.service.ts. Todos os métodos que teremos que emular dentro de
 * nosso arquivo de testes foram especificados com o valor jest.fn()
 */
const mockUserRepository = () => ({
  createUser: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findUsers: jest.fn(),
});

/**
 * Utilizamos para separar as partes do nosso teste, sendo que podemos iniciar
 * um describe dentro de outro de forma aninhada
 */
describe('UsersService', () => {
  let userRepository;
  let service;

  /** É uma função que será executada antes de cada teste a sser realizado.
   * No Caso utilizamos ela para inicializar nosso módulo e suas dependencias
   * que serão utilizadas durante os testes.
   */
  beforeEach(async () => {
    /* Eles simulam a inicialização de um módulo e suas dependências. */
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
    service = await module.get<UsersService>(UsersService);
  });

  /**
   * É utilizado para descrevermos cada teste que será realizado. No caso o primeiro
   * teste que realizamos é se o UsersService e o UserRepository foram
   * incicializados com sucesso.
   */
  it('should be defined', () => {
    /**
     * Através do expect verificamos se as coisas aconteceram como esperado.
     */
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    let mockCreateUserDto: CreateUserDto;

    /**
     * Utilizamos para inicializarmos o valod do mockCreateUserDto, que é o
     * argumento esperado pelo o método createAdminUser e dentro dos nossos testes
     * queremos ter controle sobre a entrada do método
     */
    beforeEach(() => {
      mockCreateUserDto = {
        email: 'exemple@email.com',
        name: 'Username',
        password: '@Ex123456',
        passwordConfirmation: '@Ex123456',
      };
    });

    it('should create an user if passwords match', async () => {
      /** mockresolvedValue simula uma execução bem sucedida de uma função assincrona */
      userRepository.createUser.mockResolvedValue('mockUser');
      const result = await service.createAdminUser(mockCreateUserDto);

      expect(userRepository.createUser).toHaveBeenCalledWith(
        mockCreateUserDto,
        UserRole.ADMIN,
      );

      expect(result).toEqual('mockUser');
    });

    it('should throw an error if passwords doesnt match', async () => {
      mockCreateUserDto.passwordConfirmation = 'wrongPassword';
      expect(service.createAdminUser(mockCreateUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('findUserById', () => {
    it('should return the found user', async () => {
      userRepository.findOne.mockResolvedValue('mockUser');
      expect(userRepository.findOne).not.toHaveBeenCalled();

      const result = await service.findUserById('mockId');
      const select = ['email', 'name', 'role', 'id'];
      expect(userRepository.findOne).toHaveBeenCalledWith('mockId', { select });
      expect(result).toEqual('mockUser');
    });

    it('should throw an error as user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(service.findUserById('mockId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should return affected > 0 if user is deleted', async () => {
      userRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteUser('mockId');
      expect(userRepository.delete).toHaveBeenCalledWith({ id: 'mockId' });
    });

    it('should throw an error if no user is deleted', async () => {
      userRepository.delete.mockResolvedValue({ affected: 0 });

      expect(service.deleteUser('mockId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUsers', () => {
    it('should call the findUsers method of the userRepository', async () => {
      userRepository.findUsers.mockResolvedValue('resultOfsearch');
      const mockFindUsersQueryDto: FindUsersQueryDto = {
        id: '',
        name: '',
        email: '',
        limit: 1,
        page: 1,
        role: '',
        sort: '',
        status: true,
      };

      const result = await service.findUsers(mockFindUsersQueryDto);
      expect(userRepository.findUsers).toHaveBeenCalledWith(
        mockFindUsersQueryDto,
      );
      expect(result).toEqual('resultOfsearch');
    });
  });

  describe('updateUser', () => {
    it('should return affected > 0 if user data is updated and return the new user', async () => {
      userRepository.update.mockResolvedValue({ affected: 1 });
      userRepository.findOne.mockResolvedValue('mockUser');

      const result = await service.updateUser('mockUpdateUserDto', 'mockId');
      expect(userRepository.update).toHaveBeenCalledWith(
        { id: 'mockId' },
        'mockUpdateUserDto',
      );
      expect(result).toEqual('mockUser');
    });

    it('should throw an error if no row is affected in the DB', async () => {
      userRepository.update.mockResolvedValue({ affected: 0 });

      expect(service.updateUser('mockUpdateUserDto', 'mockId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});