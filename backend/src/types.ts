export type Contact = {
  contactId: any;
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

export type SMSData = {
  from: string;
  to: string;
  message: string;
}


//globla deklaration för få med user i req objektet.
import type { ObjectId } from "mongodb";

declare global {
  namespace Express {
    interface User {
      _id: ObjectId | string;
      email: string;
    }
    interface Request {
      user?: User;
      Contact
    }
  }
}
