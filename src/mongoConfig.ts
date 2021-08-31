import mongoose from "mongoose";
import { MONGODB_URI } from "./utils/secrets";

const initializeMongoose = (): mongoose.Connection => {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // By default mongoose uses findAndModify() under the hood instead of the
    // native findOneAnd{x}(). findAndModify() is deprecated, so should be
    // disabled. Not doing so generates a warning when using above functions.
    // see: https://stackoverflow.com/a/52572958
    useFindAndModify: false,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "mongo connection error"));
  return db;
};

export default initializeMongoose;
