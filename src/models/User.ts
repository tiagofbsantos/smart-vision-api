export default interface User {
  id: string;
  name?: string;
  avatar?: string;
  email: string;
  entries?: number;
  joined: Date;
};
