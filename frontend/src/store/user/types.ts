export interface User {
  username: string;
  email: string;
  emailVerified: boolean;
}

export interface UserState {
  user: User | null;
  loggedIn: boolean;
}
