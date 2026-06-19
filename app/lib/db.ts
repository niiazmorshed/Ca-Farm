import { Pool } from "pg";

const Pool = {
  connectionString: process.env.Database_url,
};

export default Pool;
