export type Contact = {
  _id?: any;
  name: string;
  phone: string;
  createdAt: string | Date;
};

export type User = {
  email: string;
  password: string;
  role: "user";
  createdAt: string | Date;
}