/**
 * Type declarations for @hanzo/gui-bento
 * These are stub declarations since bento is an external repository
 */

declare module '@hanzo/gui-bento' {
  export const CurrentRouteProvider: React.ComponentType<any>
  export const Components: Record<string, any>
  export const Data: {
    paths: Array<{ params: { section: string; part: string } }>
    listingData: {
      sections: Array<{
        sectionName: string
        parts: Array<{
          name: string
          route: string
        }>
      }>
    }
  }
  export const Sections: Record<string, Record<string, React.ComponentType<any>>>
  export const useCurrentRouteParams: () => { section?: string; part?: string }
}

declare module '@hanzo/gui-bento/raw' {
  export * from '@hanzo/gui-bento'
}

declare module '@hanzo/gui-bento/provider' {
  export const useCurrentRouteParams: () => { section?: string; part?: string }
}

declare module '@hanzo/gui-bento/data' {
  export const listingData: {
    sections: Array<{
      sectionName: string
      parts: Array<{
        name: string
        route: string
      }>
    }>
  }
  export const paths: Array<{ params: { section: string; part: string } }>
}

// Wildcard module for all bento components - exports any component
declare module '@hanzo/gui-bento/component/*' {
  const components: any
  export = components
}
