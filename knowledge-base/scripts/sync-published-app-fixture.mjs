import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const { compileDesignToPublishedApp } = await import(pathToFileURL(resolve(workspace, 'DUKA-MERCHANT/dukaDesk/src/services/compilePublishedApp.js')).href);
const source = await readFile(resolve(workspace, 'KNOWLEDGE-BASE/mobile/fixtures/merchant-project.json'), 'utf8');
const output = JSON.stringify(compileDesignToPublishedApp(JSON.parse(source), '1.2.3', '2026-09-19T00:00:00.000Z'), null, 2) + '\n';
for (const directory of ['KNOWLEDGE-BASE/mobile/fixtures', 'DUKA-MERCHANT/dukaDesk/src/services/fixtures', 'DukaDesk/__tests__/fixtures']) {
  await mkdir(resolve(workspace, directory), { recursive: true });
  await writeFile(resolve(workspace, directory, 'published-app.json'), output);
}
await writeFile(resolve(workspace, 'DUKA-MERCHANT/dukaDesk/src/services/fixtures/merchant-project.json'), source);
console.log('Updated identical published fixtures in all three repositories. Review fixture diffs before accepting contract changes.');
