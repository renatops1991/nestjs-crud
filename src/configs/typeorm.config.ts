import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  // Config mysql
  type: 'mysql',
  host: 'localhost',
  port: 8011,
  username: 'root',
  password: '',
  database: 'nestjs',
  entities:  [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true

  // Config postgre
  /*type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'pguser',
  password: 'pgpassword',
  database: 'nestjs',
  entities: [__dirname + '/../!**!/!*.entity.{js,ts}'],
  synchronize: true,*/
};

