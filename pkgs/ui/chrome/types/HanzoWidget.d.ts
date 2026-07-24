export interface HanzoWidgetProps {
    /** The repo the AI widget edits, e.g. "hanzo-docs/chat". Sets <meta name="hanzo:repo">. */
    repo: string;
    /** Optional git provider (github/gitlab/…). Sets <meta name="hanzo:provider">. */
    provider?: string;
    /** Optional path scope within the repo. Sets <meta name="hanzo:path">. */
    path?: string;
    /** Loader script. Defaults to the canonical hanzo.app edit.js. */
    src?: string;
}
/**
 * HanzoWidget — the AI-widget MOUNT (loader only).
 *
 * Injects the `<meta name="hanzo:repo">` convention (+ provider/path) and loads
 * the async `edit.js` loader once. The widget's BEHAVIOUR is owned by a separate
 * workstream (edit.js); this component is purely the mount/meta contract, so any
 * Hanzo surface can opt in with one line: `<HanzoWidget repo="org/repo" />`.
 */
export declare function HanzoWidget({ repo, provider, path, src }: HanzoWidgetProps): null;
//# sourceMappingURL=HanzoWidget.d.ts.map