import mysql from "mysql2";

const isLocal = process.env.NODE_ENV === "local";

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: isLocal ? { rejectUnauthorized: false } : { rejectUnauthorized: true },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

connection.getConnection((err, conn) => {
  if (err) throw err;
  console.log("Connected to MySQL/TiDB!");
  conn.release();
});

export default connection;
