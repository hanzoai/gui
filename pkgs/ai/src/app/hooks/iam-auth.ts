import { open } from '@tauri-apps/plugin-shell';
import { safeListen } from '../utils/tauri-check';
import { useCallback, useRef, useState } from 'react';
import { useBrand } from '@hanzo_network/brand-config';
import { iamUrl } from '../lib/iam-oidc';

// Brand-neutral IAM login. Everything brand-specific (auth host, OAuth client,
// redirect scheme, callback event) comes from the active brand's `iam` config
// (see @hanzo_network/brand-config). Adding a brand = adding a config entry;
// nothing here is hardcoded to any one brand. Public-client PKCE flow (no
// client secret shipped in the binary).

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
};

type LoginState = {
  isLoading: boolean;
  error: string | null;
  tokens: AuthTokens | null;
};

function randomHex(bytes: number): string {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => b.toString(16).padStart(2, '0')).join('');
}

function base64UrlEncode(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function pkceChallenge(verifier: string): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64UrlEncode(new Uint8Array(hash));
}

async function exchangeCodeForTokens(
  baseUrl: string,
  clientId: string,
  redirectUri: string,
  code: string,
  codeVerifier: string,
): Promise<AuthTokens> {
  const response = await fetch(iamUrl(baseUrl, 'token'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }).toString(),
  });
  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }
  return response.json() as Promise<AuthTokens>;
}

export function useIamLogin() {
  const { iam } = useBrand();
  const [state, setState] = useState<LoginState>({
    isLoading: false,
    error: null,
    tokens: null,
  });
  const pendingState = useRef<string | null>(null);
  const verifierRef = useRef<string | null>(null);

  const login = useCallback(async (): Promise<AuthTokens> => {
    const oauthState = randomHex(32);
    const verifier = base64UrlEncode(crypto.getRandomValues(new Uint8Array(48)));
    const challenge = await pkceChallenge(verifier);
    pendingState.current = oauthState;
    verifierRef.current = verifier;

    const authUrl = new URL(iamUrl(iam.baseUrl, 'authorize'));
    authUrl.searchParams.set('client_id', iam.clientId);
    authUrl.searchParams.set('redirect_uri', iam.redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid profile email');
    authUrl.searchParams.set('state', oauthState);
    authUrl.searchParams.set('code_challenge', challenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');

    await open(authUrl.toString());

    return new Promise<AuthTokens>((resolve, reject) => {
      let settled = false;
      // Listen for the active brand's callback event (emitted by the Tauri
      // deep-link handler for `<scheme>://oauth/<brand>`).
      const unlistenPromise = safeListen(iam.callbackEvent, async (event) => {
        const payload = event.payload as { state: string; code: string };
        if (payload.state !== pendingState.current || settled) return;
        settled = true;
        clearTimeout(timeout);
        pendingState.current = null;
        void unlistenPromise.then((fn) => fn?.());
        try {
          resolve(
            await exchangeCodeForTokens(
              iam.baseUrl,
              iam.clientId,
              iam.redirectUri,
              payload.code,
              verifierRef.current as string,
            ),
          );
        } catch (err) {
          reject(err);
        }
      });

      const timeout = setTimeout(() => {
        if (settled) return;
        settled = true;
        pendingState.current = null;
        void unlistenPromise.then((fn) => fn?.());
        reject(new Error('OAuth login timed out'));
      }, 300_000); // 5 min
    });
  }, [iam.baseUrl, iam.clientId, iam.redirectUri, iam.callbackEvent]);

  const startLogin = useCallback(() => {
    setState({ isLoading: true, error: null, tokens: null });
    login()
      .then((tokens) => setState({ isLoading: false, error: null, tokens }))
      .catch((err) =>
        setState({ isLoading: false, error: String(err?.message ?? err), tokens: null }),
      );
  }, [login]);

  const resetState = useCallback(() => {
    setState({ isLoading: false, error: null, tokens: null });
    pendingState.current = null;
    verifierRef.current = null;
  }, []);

  return { ...state, login, startLogin, resetState };
}
