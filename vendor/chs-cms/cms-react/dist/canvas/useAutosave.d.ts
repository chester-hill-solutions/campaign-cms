export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type Options<T> = {
    content: T;
    /** Autosave is paused until the initial content has loaded. */
    ready: boolean;
    /** Invalid documents are not saved (errors surface on the canvas). */
    valid: boolean;
    save: (content: T) => Promise<{
        ok: true;
    } | {
        ok: false;
        error: string;
    }>;
    delayMs?: number;
};
/**
 * Debounced autosave with an explicit `flush` (used by Cmd+S and Publish).
 * Tracks dirtiness against the last successfully saved snapshot.
 */
export declare function useAutosave<T>({ content, ready, valid, save, delayMs, }: Options<T>): {
    status: AutosaveStatus;
    error: string | null;
    dirty: boolean;
    flush: () => Promise<boolean>;
    markSaved: (snapshot: T) => void;
};
export {};
