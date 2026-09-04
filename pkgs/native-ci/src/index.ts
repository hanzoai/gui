/**
 * @hanzogui/native-ci
 *
 * Native CI/CD helpers for React Native apps with Expo.
 * Provides fingerprint-based build caching and Detox test runners for GitHub Actions.
 */

// Constants and types
export {
  METRO_HOST,
  METRO_PORT,
  METRO_URL,
  DETOX_SERVER_PORT,
  DEFAULT_METRO_WAIT_ATTEMPTS,
  DEFAULT_METRO_WAIT_INTERVAL_MS,
  DEFAULT_METRO_TIMEOUT_MS,
  DEFAULT_KV_TTL_SECONDS,
  type Platform,
  type ExpoManifest,
} from './constants.ts'

// Fingerprint generation
export {
  generateFingerprint,
  generatePreFingerprintHash,
  type FingerprintOptions,
  type FingerprintResult,
} from './fingerprint.ts'

// Caching utilities
export {
  createCacheKey,
  saveFingerprintToKV,
  getFingerprintFromKV,
  extendKVTTL,
  saveCache,
  loadCache,
  type CacheOptions,
  type RedisKVOptions,
  type LocalCacheOptions,
} from './cache.ts'

// Build runner
export {
  runWithCache,
  setGitHubOutput,
  isGitHubActions,
  isCI,
  type RunWithCacheOptions,
  type RunWithCacheResult,
} from './runner.ts'

// Metro bundler utilities
export {
  waitForMetro,
  prewarmBundle,
  startMetro,
  setupSignalHandlers,
  withMetro,
  type MetroOptions,
  type MetroProcess,
} from './metro.ts'

// Detox test runner utilities
export {
  parseDetoxArgs,
  buildDetoxArgs,
  runDetoxTests,
  type DetoxRunnerOptions,
} from './detox.ts'

// Android utilities (disabled but kept for future use)
export {
  waitForDevice,
  setupAdbReverse,
  setupAndroidDevice,
  ensureAndroidFolder,
} from './android.ts'

// iOS utilities
export { ensureIOSFolder, ensureIOSApp, cleanupSimulators } from './ios.ts'

// Dependency management
export {
  checkDeps,
  ensureIosDeps,
  ensureAndroidDeps,
  ensureMaestro,
  printDepsStatus,
  type DepsCheckResult,
} from './deps.ts'
