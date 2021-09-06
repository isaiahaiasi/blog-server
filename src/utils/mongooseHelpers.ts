import { Types } from "mongoose";
import createLogger from "./debugHelper";

const debug = createLogger("endpoints");

export const castObjectId = (string: string): Types.ObjectId | null => {
  try {
    return Types.ObjectId(string);
  } catch (err) {
    debug(`Could not cast ${string} to mongoose.Types.ObjectId`);
    return null;
  }
};
