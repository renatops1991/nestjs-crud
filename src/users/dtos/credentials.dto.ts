import { ApiProperty } from '@nestjs/swagger';

export class CredentialsDto{
  @ApiProperty({description: 'Email required to authentication'})
  email: string;

  @ApiProperty({description: 'Password required to authentication'})
  password: string
}
