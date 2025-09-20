import { exec } from "child_process";
import pidusage from "pidusage"; // npm install pidusage

// Function to run wrk and fetch CPU info
export function benchmarkWithCPU(url, duration = 30, threads = 2, connections = 50, pid = process.pid) {
  return new Promise((resolve, reject) => {
    const wrkCommand = `wrk -t${threads} -c${connections} -d${duration}s ${url}`;

    console.log(`Running: ${wrkCommand}`);

    // Start wrk test
    const wrkProcess = exec(wrkCommand, async (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`);
        return;
      }

      try {
        // Fetch CPU info of the given process ID
        const stats = await pidusage(pid);

        resolve({
          wrkOutput: stdout,
          cpuUsage: stats.cpu.toFixed(2) + "%",
          memoryUsage: (stats.memory / 1024 / 1024).toFixed(2) + " MB",
        });
      } catch (cpuError) {
        reject(cpuError);
      }
    });
  });
}