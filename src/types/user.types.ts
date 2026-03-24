
export interface IUser {
  username: string;
  email: string;
  password?: string;
  role: 'employee' | 'employer' | 'admin';
}


export interface IUserMethods {
  comparePassword(plainPassword: string): Promise<boolean>;
}