export default {
  // Application port
  PORT: process.env.PORT || 3000,

  // JWT Secrets (keep these safe — never push to GitHub)
  ACCESS_SECRET: process.env.ACCESS_SECRET || "myaccesssecret123",
  REFRESH_SECRET: process.env.REFRESH_SECRET || "myrefreshsecret456",

  // Token Expirations
  ACCESS_EXPIRES_IN: "1h",   // short-lived access token
  REFRESH_EXPIRES_IN: "7d",   // long-lived refresh token

  "development": {
    username: "postgres",
    password: "PGSQL-92",
    database: "taskmanager",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  "test": {
    username: "postgres",
    password: "PGSQL-92",
    database: "taskmanager",
    host: "127.0.0.1",
    dialect: "postgres"
  },
  production: {
    username: "postgres",
    password: "PGSQL-92",
    database: "taskmanager",
    host: "127.0.0.1",
    dialect: "postgres"
  }

};
