import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION 
});
const s3 = new AWS.S3();

const uploadFile = async (localFilePath) => {
    console.log(localFilePath)
    try{
        if(!localFilePath){
            return null;
        }
        const fileContent = fs.readFileSync(localFilePath);
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: path.basename(localFilePath),
            Body: fileContent
        };
        const result = await s3.upload(params).promise();
        fs.unlinkSync(localFilePath);
        return result.Location;
    }
    catch(error){
        console.log(error);
    }
}

export { uploadFile }