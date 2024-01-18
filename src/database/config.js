import mongoose from 'mongoose';

let conn = null
const uri = process.env.DB_URI;
exports.connectDatabase = async () => {
  if (conn == null) {
    conn = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    }).then(() => mongoose);
    await conn;
  }
  console.log("Database connected")
  return conn;
};
          