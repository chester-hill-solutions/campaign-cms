import { useCallback, useState } from 'react';
const MAX_HISTORY = 80;
/** Edits within this window from the group's first edit share one undo step. */
const COALESCE_WINDOW_MS = 600;
/**
 * Snapshot-based undo/redo over the whole document. Rapid edits (typing)
 * coalesce into single undo steps.
 */
export function useDocHistory(initial) {
    const [state, setState] = useState({
        past: [],
        present: initial,
        future: [],
        lastPushAt: null,
    });
    const set = useCallback((next) => {
        const now = Date.now();
        setState((s) => {
            if (Object.is(s.present, next))
                return s;
            if (s.lastPushAt === null ||
                now - s.lastPushAt > COALESCE_WINDOW_MS ||
                now < s.lastPushAt) {
                return {
                    past: [...s.past.slice(-(MAX_HISTORY - 1)), s.present],
                    present: next,
                    future: [],
                    lastPushAt: now,
                };
            }
            return { ...s, present: next, future: [] };
        });
    }, []);
    /** Replace the document without recording history (initial load, restore). */
    const reset = useCallback((next) => {
        setState({ past: [], present: next, future: [], lastPushAt: null });
    }, []);
    const undo = useCallback(() => {
        setState((s) => {
            if (s.past.length === 0)
                return s;
            return {
                past: s.past.slice(0, -1),
                present: s.past[s.past.length - 1],
                future: [s.present, ...s.future],
                lastPushAt: null,
            };
        });
    }, []);
    const redo = useCallback(() => {
        setState((s) => {
            if (s.future.length === 0)
                return s;
            return {
                past: [...s.past, s.present],
                present: s.future[0],
                future: s.future.slice(1),
                lastPushAt: null,
            };
        });
    }, []);
    return {
        content: state.present,
        set,
        reset,
        undo,
        redo,
        canUndo: state.past.length > 0,
        canRedo: state.future.length > 0,
    };
}
