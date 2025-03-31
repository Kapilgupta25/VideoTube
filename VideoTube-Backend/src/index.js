import dotenv from 'dotenv';
import app from './app.js';
import connect_DB from './db/index.js';


dotenv.config({
    path: './env'
})


connect_DB()
.then(()=>{
    // if no error then server will start on the port
    app.on('error', (error) => {
        console.error('Error starting the server: ', error);
    })
    
    app.listen(process.env.PORT || 8080, () =>{
        console.log(`Server is running on port ${process.env.PORT || 8080}`);
    })
})
.catch((error) => {
    console.error('MONGODB connection FAILED!!! : ', error);

})


/* Another Approch 

import express from 'express';
import { DB_NAME } from './constants';
import mongoosses from 'mongoose';
const app = express();

// iffi(no need to call the function of iffi) to connect to the database and start the server
( async () => {
    try {
        // Connect to the database using the MONGO_URI and DB_NAME
        await mongoosses.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        // agar koi error aata hai while connecting the database then it will throw an error
        app.on("error", (error) => {
            console.error('Error starting the server: ', error);
        });
        // if no error then server will start on the port
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error('Error connecting to the database: ', error);
        throw error;
    }
} )()
*/