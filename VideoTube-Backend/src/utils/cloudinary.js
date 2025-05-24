import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';


// Configuring cloudinary with the credentials for uploading images and videos to cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localfilepath) => {
    try{
        // Checking if the file path is provided or not
        if(!localfilepath){
            console.log("No file path provided");
        }
        
        // Uploading the file to cloudinary
        const response = await cloudinary.uploader.upload
        (localfilepath, {
            resource_type: "auto"
        })
        // Returning the response from cloudinary and printing the URL of the uploaded file
        console.log("File uploaded successfully to cloudinary", response.url);
        // Removing the file from the local storage after uploading it to cloudinary
        fs.unlinkSync(localfilepath);
        return response;

    } catch (error){
        // removing the file from the local storage if there is an error in uploading the file to cloudinary and printing the error
        fs.unlinkSync(localfilepath)
        console.log("Error in uploading file to cloudinary", error);
        
    }
}

export { uploadOnCloudinary };
