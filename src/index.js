import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import fs from "fs";
import path from "path";
import { generate } from "./util.js";
import { estimateRAM } from "./estimateRam.js";
import { createClient } from "redis";

const publisher = createClient({ url: process.env.REDIS_URL });
await publisher.connect();

const PORT = process.env.PORT || 4000;
const REPOS_DIR = process.env.REPOS_DIR || path.join(process.cwd(), "repos");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  try {
    const repoUrl = req.body.repoUrl;
    if (!repoUrl) return res.status(400).json({ error: "repoUrl required" });

    const id = generate();
    const repoPath = path.join(REPOS_DIR, id);

    fs.mkdirSync(repoPath, { recursive: true });

    await simpleGit().clone(repoUrl, repoPath);

    // ✅ Run RAM estimation
    const ramEstimate = estimateRAM(repoPath);

    // ✅ Send estimate back
    res.json({ id, path: repoPath, ramEstimate });
  } catch (err) {
    console.error("Deploy error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`App running on port ${PORT}`));
