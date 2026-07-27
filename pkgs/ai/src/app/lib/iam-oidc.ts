/**
 * Canonical IAM OIDC paths (HIP-0111), mirrored locally because
 * `pkgs/ai` is intentionally not a dependent of the full `@hanzo/iam` SDK.
 *
 * The paths below are byte-for-byte the SDK's `OIDC_PATHS`
 * (see `@hanzo/iam` `src/paths.ts` and the reference mirror at
 * `@hanzo/ui` `src/auth/iam.ts`). There is no `/api/` prefix and no legacy
 * `/oauth/*` or `/login/oauth/*`. PKCE (S256) is always on at the call site.
 */

/** OIDC endpoint paths, relative to the brand `serverUrl`. Mirrors `@hanzo/iam` `OIDC_PATHS`. */
export const IAM_OIDC_PATHS = {
  authorize: '/v1/iam/oauth/authorize',
  token: '/v1/iam/oauth/token',
  userinfo: '/v1/iam/oauth/userinfo',
  jwks: '/v1/iam/.well-known/jwks',
  logout: '/v1/iam/oauth/logout',
} as const;

const trim = (s: string): string => s.replace(/\/+$/, '');

/** Absolute IAM endpoint URL from a brand origin and a path key. */
export function iamUrl(serverUrl: string, key: keyof typeof IAM_OIDC_PATHS): string {
  return `${trim(serverUrl)}${IAM_OIDC_PATHS[key]}`;
}
