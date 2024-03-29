import User, { IUser } from "../models/User";
import { castObjectId } from "../utils/mongooseHelpers";

// * Query interfaces
interface UserQueries {
  addUserToDB: { (user: IUser): Promise<Partial<IUser> | null> };
  getUserFromDBById: { (id: string): Promise<IUser | null> };
  getUserFromDB: { (userMatch: Partial<IUser>): Promise<IUser | null> };
  putUserInDB: { (id: string, user: Partial<IUser>): Promise<IUser | null> };
  deleteUserFromDB: { (id: string): Promise<IUser | null> };
  getAllUsersFromDB: { (): Promise<IUser[]> };
  getUserSecretFromDB: { (id: string): Promise<string | null> };
  setUserSecretInDB: {
    (identifier: Partial<IUser>, secret: string): Promise<IUser | null>;
  };
}

// * Query implementations

const SELECT_PUBLIC_USER_FIELDS = "-password -tkey";

const mongoQueries: UserQueries = {
  addUserToDB: (userData) => {
    return new User(userData).save().then((user) => ({
      username: user.username,
      _id: user._id,
    }));
  },

  getUserFromDBById: async (id) => {
    const userId = castObjectId(id);

    if (!userId) {
      return null;
    }

    return User.findById(userId, SELECT_PUBLIC_USER_FIELDS).exec();
  },

  getUserFromDB: async (userMatch) => {
    return User.findOne(userMatch).exec();
  },

  getAllUsersFromDB: async () => {
    return User.find({}).select(SELECT_PUBLIC_USER_FIELDS).exec();
  },

  putUserInDB: async (id, userData) => {
    const userId = castObjectId(id);

    if (!userId) {
      return null;
    }

    return User.findByIdAndUpdate(userId, userData, { new: true }).select(
      SELECT_PUBLIC_USER_FIELDS
    );
  },

  deleteUserFromDB: async (id) => {
    const userId = castObjectId(id);

    if (!userId) {
      return null;
    }

    return User.findByIdAndDelete(userId).select(SELECT_PUBLIC_USER_FIELDS);
  },

  getUserSecretFromDB: async (id) => {
    const userId = castObjectId(id);

    if (!userId) {
      return null;
    }

    const { tkey } = (await User.findById(userId, "tkey").exec()) as IUser;

    return tkey ?? null;
  },

  setUserSecretInDB: async (userIdentifier, secret) => {
    const { _id, username } = userIdentifier;

    const userId = castObjectId(_id as string);

    if (_id && userId) {
      return User.findByIdAndUpdate(userId, {
        tkey: secret,
      }).exec();
    } else if (username) {
      return User.findOneAndUpdate({ username }, { tkey: secret }).exec();
    }

    return null;
  },
};

// * Export desired implementation
const userQueries = mongoQueries;
export default userQueries;
