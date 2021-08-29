import User, { IUser } from "../models/User";
import { castObjectId } from "../utils/mongooseHelpers";

// * Query interfaces
interface UserQueries {
  addUserToDB: { (user: IUser): Promise<IUser | null> };
  getUserFromDB: { (id: string): Promise<IUser | null> };
  putUserInDB: { (id: string, user: Partial<IUser>): Promise<IUser | null> };
  deleteUserFromDB: { (id: string): Promise<IUser | null> };
  getAllUsersFromDB: { (): Promise<IUser[]> };
}

// * Query implementations
// Really like having an object for this,
// the only downside is that now these functions aren't tree-shakeable
// but it's a small enough amount of code that it shouldn't matter
const mongoQueries: UserQueries = {
  addUserToDB: (user) => {
    return new User(user).save();
  },

  getUserFromDB: async (id) => {
    const userId = castObjectId(id);

    if (!userId) {
      return userId;
    }

    return User.findById(userId, "username").exec();
  },

  getAllUsersFromDB: async () => {
    return User.find({}).select("-password").exec();
  },

  putUserInDB: async (id, user) => {
    const userId = castObjectId(id);

    if (!userId) {
      return null;
    }

    return User.findByIdAndUpdate(userId, user);
  },

  deleteUserFromDB: async (id) => {
    const userId = castObjectId(id);

    if (!userId) {
      return null;
    }

    return User.findByIdAndDelete(userId);
  },
};

// * Export desired implementation
export default mongoQueries;
