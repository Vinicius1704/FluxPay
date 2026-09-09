import { existsSync, mkdirSync, openSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'

const root = process.cwd()
const tmpPath = join(root, 'tmp')
const pidPath = join(tmpPath, 'fluxpay-dev.pid')
const logPath = join(tmpPath, 'fluxpay-dev.log')
const errorLogPath = join(tmpPath, 'fluxpay-dev.error.log')

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', ...options })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

function runningPid() {
  if (!existsSync(pidPath)) return null
  const pid = Number(readFileSync(pidPath, 'utf8').trim())
  try {
    process.kill(pid, 0)
    return pid
  } catch {
    return null
  }
}

async function waitForServerAddress() {
  const deadline = Date.now() + 15_000
  while (Date.now() < deadline) {
    const output = existsSync(logPath) ? readFileSync(logPath, 'utf8') : ''
    const address = output.match(/Server address:\s*(http:\/\/\S+)/)?.[1]
    if (address) return address
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  return null
}

async function startServer() {
  if (process.platform === 'win32') {
    const starterPath = join(root, 'scripts', 'start_hidden_server.ps1')
    const launcher = spawn(
      'powershell.exe',
      [
        '-NoProfile',
        '-NonInteractive',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        starterPath,
        '-NodePath',
        process.execPath,
        '-WorkingDirectory',
        root,
        '-LogPath',
        logPath,
        '-ErrorLogPath',
        errorLogPath,
      ],
      { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true }
    )

    return await new Promise((resolve, reject) => {
      let output = ''
      let errorOutput = ''
      const timeout = setTimeout(() => {
        reject(new Error('O lançador oculto do FluxPay não retornou um PID em 5 segundos.'))
      }, 5_000)

      launcher.stdout.on('data', (chunk) => {
        output += chunk.toString()
        const serverPid = Number(output.trim())
        if (Number.isInteger(serverPid) && serverPid > 0) {
          clearTimeout(timeout)
          launcher.stdout.destroy()
          launcher.stderr.destroy()
          launcher.unref()
          resolve(serverPid)
        }
      })

      launcher.stderr.on('data', (chunk) => {
        errorOutput += chunk.toString()
      })

      launcher.once('error', reject)
      launcher.once('exit', (code) => {
        if (!output.trim()) {
          clearTimeout(timeout)
          reject(new Error(errorOutput || `O lançador oculto terminou com código ${code}.`))
        }
      })
    })
  }

  const log = openSync(logPath, 'a')
  const child = spawn(process.execPath, ['ace.js', 'serve', '--hmr'], {
    cwd: root,
    detached: true,
    stdio: ['ignore', log, log],
  })
  child.unref()
  return child.pid
}

mkdirSync(tmpPath, { recursive: true })
run('docker', ['compose', 'up', '-d'])
run(process.execPath, ['ace.js', 'migration:run'])
run(process.execPath, ['ace.js', 'db:seed'])

const pid = runningPid()
if (pid) {
  console.log(`FluxPay já está em execução (PID ${pid}).`)
} else {
  writeFileSync(logPath, '')
  writeFileSync(errorLogPath, '')
  const serverPid = await startServer()
  if (!Number.isInteger(serverPid) || serverPid <= 0) {
    throw new Error('Não foi possível identificar o processo do servidor FluxPay.')
  }
  writeFileSync(pidPath, String(serverPid))
  const address = await waitForServerAddress()
  console.log(address ? `FluxPay disponível em ${address}` : `FluxPay está iniciando. Acompanhe o endereço em ${logPath}`)
}
