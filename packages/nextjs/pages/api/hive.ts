import { exec } from "child_process";
import type { NextApiRequest, NextApiResponse } from "next";
import { platform } from "os";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { inputURI } = req.body;

  if (!inputURI) {
    return res.status(400).json({ error: "Missing inputURI in request body" });
  }

  // Set environment variables
  const pKey = process.env.PRIVATE_KEY || "5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";

  // publicKey: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
  const debug = true;

  const w = path.dirname(__dirname);
  console.log({ w });
  let hiveCli: string; // = path.join(w, "hive");

  const platform = process.platform;
  let hiveBin: string = "hive-mac";

  if (platform === "linux") {
    hiveBin = "hive-linux";
  } else if (platform === "darwin") {
    hiveBin = "hive-mac";
  }
  // } else {
  //   console.error("Unsupported platform");
  //   process.exit(1);
  // }

  hiveCli = process.env.HIVE_CLI || path.join("./pages/api/cli", hiveBin);

  // hiveCli = "hive"

  // Construct the command
  const command = `HIVE_PRIVATE_KEY=${pKey} DEBUG=${debug} ${hiveCli} run cowsay:v0.1.2`;

  // Execute the command
  const childProcess = exec(command);

  // Handle output
  let outputFolder: string | null = null;
  let stderr: string | null = null;

  childProcess.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
    outputFolder = extractLocationURL(data.toString());
  });

  childProcess.stderr.on("data", data => {
    console.error(`stderr: ${data}`);
    stderr = data.toString();
  });

  // Handle command completion
  childProcess.on("close", code => {
    console.log(`child process exited with code ${code}`);
    if (code === 0) {
      if (outputFolder) {
        res.status(200).json({ outputFolder });
      } else {
        res.status(500).json({ error: `Failed to extract output folder from command output` });
      }
    } else {
      res.status(500).json({ error: `Command execution failed with code ${code}: ${stderr || ""}` });
    }
  });
}

// Extract the location URL from the output
export function extractLocationURL(output: string): string | null {
  // Match the URL pattern
  const regex = /open\s+(.*)\s+cat\s+.*\s+cat\s+.*\s+(https?:\/\/\S+)/;
  const match = output.match(regex);
  return match ? match[1] : null;
}
