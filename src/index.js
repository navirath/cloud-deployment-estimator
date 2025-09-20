import express from "express";
import cors from "cors";
import { simpleGit } from "simple-git";
import { generate } from "./util.js";
import path from "path";
import { getAllFiles } from "./file.js";
import { estimateRAM } from "./RAM/estimateRam.js";
import { createClient } from "redis";
import { benchmarkWithCPU } from "./CPU/cpu.js";
const publisher = createClient();
publisher.connect();



// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import fs from "fs";

// const s3 = new S3Client({
//   region: "us-east-1",
//   endpoint: "http://localhost:4566",  // LocalStack S3 endpoint
//   forcePathStyle: true,               // important for LocalStack
//   credentials: {
//     accessKeyId: "test",
//     secretAccessKey: "test"
//   }
// });

// const BUCKET = "my-local-bucket"; // create this bucket once with AWS CLI



const PORT = 4000;
const app = express();

app.use(cors());
app.use(express.json()); //middleware

app.post("/deploy", async (req, res) => {
    try{
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    const id = generate();
    await simpleGit().clone(repoUrl,  `../output/${id}`);
    const files = getAllFiles( `../output/${id}`);
  

//     for (const file of files) {
//   const relativePath = path.relative(`../output/${id}`, file);
//   await uploadFileToS3(file, `${id}/${relativePath}`);
// }

    publisher.lPush("build-queue", id);
    
    console.log(estimateRAM(`../output/${id}`));


//     async function runTest() {
//   try {

//     // Change URL to your running project
//     const results = await benchmarkWithCPU("http://localhost:3000", 15, 2, 50);

//     console.log("📊 Benchmark Results:");
//     console.log("wrk output:\n", results.wrkOutput);
//     console.log("CPU usage:", results.cpuUsage);
//     console.log("Memory usage:", results.memoryUsage);
//   } catch (err) {
//     console.error("❌ Error running benchmark:", err);
//   }
// }

// runTest();
        

    res.json({
        id: id
    });
} catch(err) {
    console.log("Deploy error : ", err);
    res.status(500).json({ error: err.message})
}
});
app.listen(PORT, () => { console.log("app is listening on the port ", PORT); });
//# sourceMappingURL=index.js.map