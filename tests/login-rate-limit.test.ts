import { describe, expect, it } from "vitest";
import {
  isLoginRateLimited,
  loginRateLimitWindowStart,
  LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
  LOGIN_RATE_LIMIT_WINDOW_MS,
} from "@/lib/auth/login-rate-limit";

describe("limite de tentativas do login administrativo", () => {
  it("usa uma janela móvel de quinze minutos", () => {
    const now = new Date("2026-08-28T15:30:00.000Z");
    expect(loginRateLimitWindowStart(now).getTime()).toBe(now.getTime() - LOGIN_RATE_LIMIT_WINDOW_MS);
  });

  it("bloqueia ao atingir o limite configurado", () => {
    expect(isLoginRateLimited(LOGIN_RATE_LIMIT_MAX_ATTEMPTS - 1)).toBe(false);
    expect(isLoginRateLimited(LOGIN_RATE_LIMIT_MAX_ATTEMPTS)).toBe(true);
  });
});
