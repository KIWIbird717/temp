import mongoose from "mongoose"


const DB_URL: string = process.env.DB_URL

export const dbConnection = async (): Promise<void> => {
  /**
   * Create connection with MongoDB
   * You can specify connect options by adding an Object in @function mongoose.connect
   */

  try {
    await mongoose.connect(DB_URL as string)

    console.log("\x1b[32m", '[MongoDB]: Status OK. DB successfully connected')
  } catch(err) {
    throw new Error(`[MongoDB]: Can not connect to MongoDB. ${err}`)
  }
}

export const dbDisconnection = async (): Promise<void> => {
  /**
   * Disconnect from MongoDB
   */

  try {
    await mongoose.connection.close()

    console.log("\x1b[32m", '[MongoDB]: DB successfully disconnected')
  } catch(err) {
    throw new Error(`[MongoDB]: Can not disconnect from MongoDB. ${err}`)
  }
}
