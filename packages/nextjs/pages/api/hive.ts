import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Missing input in request body' });
  }

  try {
    const { stdout, stderr } = await execAsync(`hive ${input}`);
    if (stderr) {
      return res.status(500).json({ error: `Error executing command: ${stderr}` });
    }
    res.status(200).json({ output: stdout });
  } catch (error:any) {
    res.status(500).json({ error: `Execution failed: ${error.message}` });
  }
}
