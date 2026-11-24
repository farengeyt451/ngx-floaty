/**
 * Consumer smoke test: installs the packed library into a fresh `ng new` app of a given
 * Angular version, then builds it (AOT + strict templates) and runs its unit test.
 *
 *   node scripts/consumer-smoke/run.mjs [--angular 21|22|next] [--tarball path/to/ngx-floaty-x.y.z.tgz] [--keep]
 *
 * Without --tarball the library is built and packed first. The app is created in a temp
 * directory, removed afterwards unless --keep is passed.
 */
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const { values: args } = parseArgs({
  options: {
    angular: { type: 'string', default: '21' },
    tarball: { type: 'string' },
    keep: { type: 'boolean', default: false },
  },
});

const repoRoot = resolve(import.meta.dirname, '../..');
const fixtures = join(import.meta.dirname, 'fixtures');
const workDir = mkdtempSync(join(tmpdir(), `ngx-floaty-consumer-${args.angular}-`));
const appDir = join(workDir, 'consumer');

function run(command, commandArgs, cwd) {
  console.log(`\n$ ${command} ${commandArgs.join(' ')}   (in ${cwd})`);
  const { status } = spawnSync(command, commandArgs, { cwd, stdio: 'inherit' });
  if (status !== 0) {
    throw new Error(`"${command} ${commandArgs.join(' ')}" exited with code ${status}`);
  }
}

function packLibrary() {
  run('npm', ['run', 'build:lib'], repoRoot);
  run('npm', ['pack', '--pack-destination', workDir], join(repoRoot, 'dist/ngx-floaty'));
  const tarball = readdirSync(workDir).find(name => name.endsWith('.tgz'));
  return join(workDir, tarball);
}

/**
 * The peer range `>=21.0.0` never matches prereleases (semver rule), so an app on an Angular
 * prerelease gets ERESOLVE. Install anyway to still check that the library builds and runs there.
 */
function peerDepsFlags() {
  const { version } = JSON.parse(readFileSync(join(appDir, 'node_modules/@angular/core/package.json'), 'utf8'));
  if (!version.includes('-')) return [];
  console.warn(
    `\n@angular/core ${version} is a prerelease: the peer range does not match it, using --legacy-peer-deps.`
  );
  return ['--legacy-peer-deps'];
}

try {
  const tarball = args.tarball ? resolve(args.tarball) : packLibrary();

  run(
    'npx',
    [
      '--yes',
      `@angular/cli@${args.angular}`,
      'new',
      'consumer',
      '--defaults',
      '--interactive=false',
      '--skip-git',
      '--routing=false',
      '--ssr=false',
      '--style=css',
      '--package-manager=npm',
    ],
    workDir
  );
  run('npm', ['install', tarball, ...peerDepsFlags()], appDir);

  rmSync(join(appDir, 'src/app/app.html'), { force: true });
  rmSync(join(appDir, 'src/app/app.css'), { force: true });
  cpSync(fixtures, join(appDir, 'src/app'), { recursive: true });

  run('npx', ['ng', 'version'], appDir);
  run('npx', ['ng', 'build'], appDir);
  run('npx', ['ng', 'test', '--watch=false'], appDir);

  console.log(`\nConsumer smoke passed for Angular ${args.angular}.`);
} finally {
  if (args.keep) {
    console.log(`App kept at ${appDir}`);
  } else {
    rmSync(workDir, { recursive: true, force: true });
  }
}
