import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

const VAULT_FILE_PATH = path.resolve(process.cwd(), 'data', 'vault.json');

function parseBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', err => reject(err));
  });
}

export async function handleGetVault(_req: IncomingMessage, res: ServerResponse) {
  try {
    if (!fs.existsSync(VAULT_FILE_PATH)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Vault file not found' }));
      return;
    }

    const content = await fs.promises.readFile(VAULT_FILE_PATH, 'utf-8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.end(content);
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err?.message || 'Failed to read vault' }));
  }
}

export async function handlePostVault(req: IncomingMessage, res: ServerResponse) {
  try {
    const raw = await parseBody(req);
    const data = JSON.parse(raw);

    // Update lastSync timestamp
    if (data.meta) {
      data.meta.lastSync = new Date().toISOString();
    }

    // Ensure data directory exists
    const dir = path.dirname(VAULT_FILE_PATH);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }

    await fs.promises.writeFile(VAULT_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, lastSync: data.meta?.lastSync || new Date().toISOString() }));
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err?.message || 'Failed to update vault' }));
  }
}
