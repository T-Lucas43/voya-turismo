export const LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 10;
export const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export function loginRateLimitWindowStart(now = new Date()) {
  return new Date(now.getTime() - LOGIN_RATE_LIMIT_WINDOW_MS);
}

export function isLoginRateLimited(failedAttempts: number) {
  return failedAttempts >= LOGIN_RATE_LIMIT_MAX_ATTEMPTS;
}
