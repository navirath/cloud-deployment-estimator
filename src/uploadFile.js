import fs from "fs";
import path from "path";


async function uploadFileToS3(filePath, key) {
  const fileContent = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,           // how it will be stored in bucket
    Body: fileContent,
  });

  await s3.send(command);
  console.log(`✅ Uploaded ${key}`);
}
