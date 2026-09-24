import { defineConfig, devices } from '@playwright/test'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const systemChromium = [
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
  ...(process.platform === 'win32' ? [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ] : []),
].find((path) => path && existsSync(path))

export default defineConfig({
  testDir: './tests',
  workers: 1,
  webServer: [
    {
      command: 'npm run dev -- --host 127.0.0.1',
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: false,
    },
    {
      command: 'npm run test:e2e:server',
      url: 'http://127.0.0.1:3000/health',
      cwd: resolve(process.cwd(), '../sports-center-management-be'),
      env: { PORT: '3000', FRONTEND_ORIGIN: 'http://127.0.0.1:5173' },
      reuseExistingServer: false,
    },
  ],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], ...(systemChromium ? { launchOptions: { executablePath: systemChromium } } : {}) } }],
})
