import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mime from 'mime';
dotenv.config();


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION 
});
const s3 = new AWS.S3();

const uploadFile = async (localFilePath, folderName) => {
    try {
        if (!localFilePath) {
            return null;
        }

        // Read file content
        const fileContent = fs.readFileSync(localFilePath);

        // Get the MIME type of the file based on its extension
        const imageType = mime.getType(localFilePath);  
        if (!imageType) {
            throw new Error("Unsupported file type");
        }

        // Create a new image name with a timestamp
        const imageName = path.basename(localFilePath).toLowerCase()
            .split(" ").join("-")
            .split(".").join("-") + "-" + Date.now() + path.extname(localFilePath);

        // S3 upload parameters
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: folderName + "/" + imageName,
            Body: fileContent,
            ContentType: imageType,  // Set the Content-Type
            ContentDisposition: "inline",  // Set the Content-Disposition
        };

        // Upload the file to S3
        const result = await s3.upload(params).promise();

        // Delete the local file after upload
        fs.unlinkSync(localFilePath);

        return result.Location;  // Return the S3 URL of the uploaded file
    } catch (error) {
        console.log(error);
        return null;
    }
};

const deleteFile = async (key, folderName) => {
    const imageKey = key.split("/").pop();
    try{
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: folderName + "/" + imageKey
        };
        console.log(params)
        await s3.deleteObject(params).promise();
    }
    catch(error){
        console.log(error);
        return null;
    }
}

const createFolder = async (folderName) => {
    try{
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: folderName + "/",
            Body: ""
        };
        await s3.upload(params).promise();
        return true;
    }
    catch(error){
        console.log(error);
        return null;
    }
}

const deleteFolder = async (folderName) => {
    try {
        const listParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: folderName + "/"
        };

        const listedObjects = await s3.listObjectsV2(listParams).promise();

        if (listedObjects.Contents.length === 0) return;

        const deleteParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: { Objects: [] }
        };

        listedObjects.Contents.forEach(({ Key }) => {
            deleteParams.Delete.Objects.push({ Key });
        });

        await s3.deleteObjects(deleteParams).promise();

        // Check if there are more objects to delete
        if (listedObjects.IsTruncated) await deleteFolder(folderName);

        return true;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export { uploadFile, deleteFile, createFolder, deleteFolder };