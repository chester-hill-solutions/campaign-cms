/**
 * Snapshot-based undo/redo over the whole document. Rapid edits (typing)
 * coalesce into single undo steps.
 */
export declare function useDocHistory<T>(initial: T): {
    content: T;
    set: (next: T) => void;
    reset: (next: T) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
};
