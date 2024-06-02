import { exec } from "child_process";
import type { NextApiRequest, NextApiResponse } from "next";
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

  // doc: get Funds in http://halcyon-faucet.co-ophive.network:8085
  let pKey = process.env.PRIVATE_KEY || "5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";

  try {
    const { stdout, stderr } = await execAsync(
      `HIVE_PRIVATE_KEY=${pKey} hive run cowsay:v0.1.2 -i inputURI=${inputURI}`,
    );
    console.log({ stdout });
    if (stderr) {
      console.error({ stderr });
      return res.status(500).json({ error: `Error executing command: ${stderr}` });
    }
    res.status(200).json({ output: stdout });
  } catch (error: any) {
    console.error({ error });
    res.status(500).json({ error: `Execution failed: ${error.message}` });
  }
}
