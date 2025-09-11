export class LoginDto {
  email: string;
  password: string;
}

export class SignupDto {
  name: string;
  email: string;
  password: string;
}

export class AuthResponseDto {
  data: {
    accessToken: string;
    user: {
      name: string;
      email: string;
    };
  };
}