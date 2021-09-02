import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// mongoose 5.12.14
const mongooseOptions: mongoose.ConnectOptions = {
  // These are recommended,and will likely be default in future versions
  useNewUrlParser: true,
  useUnifiedTopology: true,

  // currently necessary to avoid deprecation notices
  // due to mongoose's current implementation
  useFindAndModify: false,

  // This option is deprecated by useUnifiedTopology
  // Not sure why this would be desirable in testing anyway?
  // reconnectTries: Number.MAX_VALUE,

  // These are now default settings
  // autoReconnect: true,
  // reconnectInterval: 1000,
};

const initializeMongooseTesting = async (): Promise<{
  (runCleanup?: boolean): Promise<boolean>;
}> => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  mongoose.connect(mongoUri, mongooseOptions);

  mongoose.connection.on("error", (err) => {
    if (err.message.code === "ETIMEDOUT") {
      console.log(err);
      mongoose.connect(mongoUri, mongooseOptions);
    }
    console.log(err);
  });

  mongoose.connection.once("open", () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });

  const cleanUpConnectionAndServer = async (runCleanup?: boolean) => {
    await mongoose.connection.close();
    return await mongoServer.stop(runCleanup);
  };

  return cleanUpConnectionAndServer;
};

export default initializeMongooseTesting;
