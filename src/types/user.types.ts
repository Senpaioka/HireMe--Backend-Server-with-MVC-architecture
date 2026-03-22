
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'employee' | 'employer' | 'admin';
}

export interface UserCreate {
    username: string;
    email: string;
    password?: string;
    role: 'employee' | 'employer' | 'admin';
}

