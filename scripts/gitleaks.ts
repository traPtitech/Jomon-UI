import { execSync, spawnSync } from 'node:child_process'
import process from 'node:process'

const args = process.argv.slice(2)

function isCommandAvailable(command: string): boolean {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function isDockerRunning(): boolean {
  try {
    execSync('docker info', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

// ローカル環境にインストールされている場合はそれを優先する
if (isCommandAvailable('gitleaks')) {
  const result = spawnSync('gitleaks', args, { stdio: 'inherit' })
  process.exit(result.status ?? 1)
}

// ローカルにない場合はDocker経由での実行を試みる（CI環境など）
if (isCommandAvailable('docker') && isDockerRunning()) {
  const dockerCmd = [
    'run',
    '--rm',
    '-v',
    `${process.cwd()}:/workspace`,
    '-w',
    '/workspace',
    'zricethezav/gitleaks@sha256:c00b6bd0aeb3071cbcb79009cb16a60dd9e0a7c60e2be9ab65d25e6bc8abbb7f',
    ...args,
  ]
  const result = spawnSync('docker', dockerCmd, { stdio: 'inherit' })
  process.exit(result.status ?? 1)
}

// CI環境ではスキャンを必須とするためエラー終了させる
if (process.env.CI) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    '❌ [Gitleaks] CI環境でgitleaksまたはDockerが利用できません。'
  )
  process.exit(1)
}

// ローカル開発時のコミットを阻害しないよう、警告を出してスキップする
console.warn(
  '\x1b[33m%s\x1b[0m',
  '⚠️  [Gitleaks] gitleaksがインストールされておらず、Dockerも起動していません。'
)
console.warn('\x1b[33m%s\x1b[0m', '⚠️  シークレットスキャンをスキップします。')
process.exit(0)
