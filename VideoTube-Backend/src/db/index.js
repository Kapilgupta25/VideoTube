import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Connect to the database using the MONGODB_URI and DB_NAME
const connect_DB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`DB Connected!! || BD_HOST: ${connectionInstance.connection.host}`);
        // console.log(connectionInstance);
    } catch (error){
        console.log("Error connecting to the database: ", error);
        process.exit(1);
    }
}


// Export the connect_DB function
export default connect_DB;
// Now, we can import the connect_DB function in the index.js file and call it to connect to the database.
