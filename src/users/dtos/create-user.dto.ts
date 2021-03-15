import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: String, description: 'Please provide a valid email address',
  })
  @IsNotEmpty({ message: 'Enter an email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(100, { message: 'The email address must be less than 100 characters' })
  email: string;

  @ApiProperty({
    type: String, description: 'The name must be less than 200 characters',
  })
  @IsNotEmpty({ message: 'Enter the user name' })
  @MaxLength(200, { message: 'The name must be less than 200 characters' })
  name: string;

  @ApiProperty({
    type: String, description: 'Password must be at least 6 characters',
  })
  @IsNotEmpty({ message: 'Enter the password' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({
    type: String,
    description: 'Password confirmation must be at least 6 characters',
  })
  @IsNotEmpty({ message: 'Enter password confirmation' })
  @MinLength(6, { message: 'Password confirmation must be at least 6 characters' })
  passwordConfirmation: string;
}