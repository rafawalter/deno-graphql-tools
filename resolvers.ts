import * as postgres from "https://deno.land/x/postgres@v0.17.0/mod.ts";
export const resolvers = {
  Query: {
    hello: () => `Hello, World!`,
    allDinosaurs: () => allDinosaurs(),
    oneDinosaur: (_: any, args: any) => oneDinosaur(args)
  },
  Mutation: {
    addDinousaur: (_: any, args: any) => addDinosaur(args)
  }
}

const allDinosaurs = async() => {
  const connection = await connect()
  const result = await connection.queryObject`
    SELECT name, description FROM dinosaurs
  `
  return result.rows
}

const oneDinosaur = async(args: any) => {
  const connection = await connect()
  const result = await connection.queryObject`
    SELECT name, description FROM dinosaurs WHERE name = ${args.name}
  `
  return result.rows
}

const addDinosaur = async(args: any) => {
  const connection = await connect()
  const result = await connection.queryObject`
  INSERT INTO dinosaurs(name,description) VALUES (${args.name}, ${args.description}) RETURNING name, description
  `
  return result.rows[0]
}

const connect = async () => {
  const databaseUrl = Deno.env.get("DATABASE_URL")
  const pool = new postgres.Poll(databaseUrl, 3, true)
  const connection =  await pool.connect()
  try {
    // Create the table
    await connection.queryObject`
    CREATE TABLE IF NOT EXISTS dinosaurs (
      name TEXT PRIMARY KEY,
      description TEXT
    )
  `;
  }
  return connection
}
