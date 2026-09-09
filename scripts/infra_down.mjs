import { existsSync, readFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const pidPath = join(root, 'tmp', 'fluxpay-dev.pid')

if (existsSync(pidPath)) {
  const pid = Number(readFileSync(pidPath, 'utf8').trim())
  if (Number.isInteger(pid) && pid > 0) {
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' })
    } else {
      try {
        process.kill(-pid, 'SIGTERM')
      } catch {}
    }
  }
  rmSync(pidPath, { force: true })
}

const result = spawnSync('docker', ['compose', 'down'], {
  cwd: root,
  stdio: 'inherit',
})
process.exit(result.status ?? 1)
