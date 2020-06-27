// Require pg - it is the node-postgres library
const { Pool } = require('pg');
// Instantiating with psql defaults
const pool = new Pool();

// Example queries that we will run against database
const queries = {
  createTable: 'CREATE TABLE person (id SERIAL, name VARCHAR(25))',
  insertData: "INSERT INTO person (name) VALUES ('User One')",
  readData: 'SELECT * FROM person WHERE id=$1',
};

const id = ['1'];

async function main() {
  // Get the connect
  const client = await pool.connect();
  try {
    const res = await client.query(queries.readData, id);
    console.log(res.rows);
  } finally {
    // Release the client
    client.release();
    // End the pool
    pool.end();
  }
}

main().catch((err) => console.log(err));
