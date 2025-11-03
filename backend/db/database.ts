import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = new SQLDatabase("travel_platform", {
  migrations: "./migrations",
});

export { db };

