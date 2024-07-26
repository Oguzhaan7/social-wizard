interface DatabaseConfig {
  mongoURI: string;
}

export const config: DatabaseConfig = {
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/social-wizard",
};
