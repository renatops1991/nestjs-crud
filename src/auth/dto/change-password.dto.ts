import { IsString, Matches, MaxLength, MinLength, minLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString({
    message: 'Enter a valid password',
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters',
  })
  @MaxLength(32, {
    message: 'Password must be a maximum 32 characters',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, a number or a symbol',
  })
  password: string;

  @IsString({
    message: 'Enter a valid password',
  })
  @MinLength(6, {
    message: 'Password must be at least 6 characters',
  })
  @MaxLength(32, {
    message: 'Password must be a maximum 32 characters',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, a number or a symbol',
  })
  passwordConfirmation: string;

}