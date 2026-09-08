// deno-lint-ignore-file
/* eslint-disable */
// biome-ignore: needed import
import type { OneRouter } from 'one'

declare module 'one' {
  export namespace OneRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes:
        | `/`
        | `/(blog)`
        | `/(blog)/blog`
        | `/(blog)/draft`
        | `/(docs)`
        | `/(docs)/api`
        | `/(site)`
        | `/(site)/`
        | `/(site)/(blog)`
        | `/(site)/(blog)/blog`
        | `/(site)/(blog)/draft`
        | `/(site)/(docs)`
        | `/(site)/(docs)/api`
        | `/(site)/api`
        | `/(site)/blog`
        | `/(site)/draft`
        | `/(site)/privacy`
        | `/(site)/theme`
        | `/(site)/theme/`
        | `/_sitemap`
        | `/api`
        | `/blog`
        | `/draft`
        | `/privacy`
        | `/reproductions/motion-bug`
        | `/reproductions/motion-bug/`
        | `/responsive-demo`
        | `/sandbox`
        | `/sandbox2`
        | `/test`
        | `/theme`
        | `/theme/`
      DynamicRoutes:
        | `/(blog)/blog/${OneRouter.SingleRoutePart<T>}`
        | `/(docs)/api/${OneRouter.SingleRoutePart<T>}`
        | `/(docs)/docs/core/${OneRouter.SingleRoutePart<T>}`
        | `/(docs)/docs/guides/${OneRouter.SingleRoutePart<T>}`
        | `/(docs)/docs/intro/${OneRouter.SingleRoutePart<T>}`
        | `/(docs)/ui/${string}`
        | `/(site)/(blog)/blog/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/(docs)/api/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/(docs)/docs/core/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/(docs)/docs/guides/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/(docs)/docs/intro/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/(docs)/ui/${string}`
        | `/(site)/api/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/blog/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/docs/core/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/docs/guides/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/docs/intro/${OneRouter.SingleRoutePart<T>}`
        | `/(site)/ui/${string}`
        | `/api/${OneRouter.SingleRoutePart<T>}`
        | `/blog/${OneRouter.SingleRoutePart<T>}`
        | `/demo/${OneRouter.SingleRoutePart<T>}`
        | `/docs/core/${OneRouter.SingleRoutePart<T>}`
        | `/docs/guides/${OneRouter.SingleRoutePart<T>}`
        | `/docs/intro/${OneRouter.SingleRoutePart<T>}`
        | `/ui/${string}`
      DynamicRouteTemplate:
        | `/(blog)/blog/[slug]`
        | `/(docs)/api/[pkg]`
        | `/(docs)/docs/core/[slug]`
        | `/(docs)/docs/guides/[slug]`
        | `/(docs)/docs/intro/[slug]`
        | `/(docs)/ui/[...subpath]`
        | `/(site)/(blog)/blog/[slug]`
        | `/(site)/(docs)/api/[pkg]`
        | `/(site)/(docs)/docs/core/[slug]`
        | `/(site)/(docs)/docs/guides/[slug]`
        | `/(site)/(docs)/docs/intro/[slug]`
        | `/(site)/(docs)/ui/[...subpath]`
        | `/(site)/api/[pkg]`
        | `/(site)/blog/[slug]`
        | `/(site)/docs/core/[slug]`
        | `/(site)/docs/guides/[slug]`
        | `/(site)/docs/intro/[slug]`
        | `/(site)/ui/[...subpath]`
        | `/api/[pkg]`
        | `/blog/[slug]`
        | `/demo/[name]`
        | `/docs/core/[slug]`
        | `/docs/guides/[slug]`
        | `/docs/intro/[slug]`
        | `/ui/[...subpath]`
      IsTyped: true
      RouteTypes: {
        '/(blog)/blog/[slug]': RouteInfo<{ slug: string }>
        '/(docs)/api/[pkg]': RouteInfo<{ pkg: string }>
        '/(docs)/docs/core/[slug]': RouteInfo<{ slug: string }>
        '/(docs)/docs/guides/[slug]': RouteInfo<{ slug: string }>
        '/(docs)/docs/intro/[slug]': RouteInfo<{ slug: string }>
        '/(docs)/ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/(site)/(blog)/blog/[slug]': RouteInfo<{ slug: string }>
        '/(site)/(docs)/api/[pkg]': RouteInfo<{ pkg: string }>
        '/(site)/(docs)/docs/core/[slug]': RouteInfo<{ slug: string }>
        '/(site)/(docs)/docs/guides/[slug]': RouteInfo<{ slug: string }>
        '/(site)/(docs)/docs/intro/[slug]': RouteInfo<{ slug: string }>
        '/(site)/(docs)/ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/(site)/api/[pkg]': RouteInfo<{ pkg: string }>
        '/(site)/blog/[slug]': RouteInfo<{ slug: string }>
        '/(site)/docs/core/[slug]': RouteInfo<{ slug: string }>
        '/(site)/docs/guides/[slug]': RouteInfo<{ slug: string }>
        '/(site)/docs/intro/[slug]': RouteInfo<{ slug: string }>
        '/(site)/ui/[...subpath]': RouteInfo<{ subpath: string[] }>
        '/api/[pkg]': RouteInfo<{ pkg: string }>
        '/blog/[slug]': RouteInfo<{ slug: string }>
        '/demo/[name]': RouteInfo<{ name: string }>
        '/docs/core/[slug]': RouteInfo<{ slug: string }>
        '/docs/guides/[slug]': RouteInfo<{ slug: string }>
        '/docs/intro/[slug]': RouteInfo<{ slug: string }>
        '/ui/[...subpath]': RouteInfo<{ subpath: string[] }>
      }
    }
  }
}

/**
 * Helper type for route information
 */
type RouteInfo<Params = Record<string, never>> = {
  Params: Params
  LoaderProps: { path: string; search?: string; subdomain?: string; params: Params; request?: Request }
}