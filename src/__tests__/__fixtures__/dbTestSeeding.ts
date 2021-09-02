/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: figure out how to assert type returned by model().save()
// (then I can get rid of the eslint-disable)

import { Model, Document } from "mongoose";
import Post, { IPost } from "../../models/Post";
import User, { IUser } from "../../models/User";

interface dbData {
  users?: Document<any, any>[];
  blogposts?: Document<any, any>[];
  comments?: Document<any, any>[];
}

function addEntries<T>(model: Model<T>, data: T[]) {
  return Promise.all(data.map((entry) => new model(entry).save()));
}

const seedDatabase = async (): Promise<dbData> => {
  const userData: IUser[] = [
    {
      username: "Steve",
      password: "password",
    },
    {
      username: "Henry",
      password: "12345678",
    },
    {
      username: "Roberto",
      password: "r0bert0",
    },
  ];

  const users = await addEntries(User, userData);

  const blogData: IPost[] = [
    {
      title: "My test title",
      content: "My test content",
      author: users[0]._id,
      publishDate: new Date(),
    },
    {
      title: "Welcome to my LAN party",
      content: "Here's a big long string of data. Blahblahblah!",
      author: users[1]._id,
      publishDate: new Date(),
    },
  ];

  const blogposts = await addEntries(Post, blogData);

  return { users, blogposts };
};

export default seedDatabase;
