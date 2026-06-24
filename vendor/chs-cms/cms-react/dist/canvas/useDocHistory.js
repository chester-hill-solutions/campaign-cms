import { useCallback, useRef, useState } from 'react';
const MAX_HISTORY = 80;
/** Edits closer together than this are folded into one undo step. */
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
    });
    const lastPushRef = useRef(0);
    const set = useCallback((next) => {
        setState((s) => {
            const now = Date.now();
            if (now - lastPushRef.current > COALESCE_WINDOW_MS) {
                lastPushRef.current = now;
                return {
                    past: [...s.past.slice(-(MAX_HISTORY - 1)), s.present],
                    present: next,
                    future: [],
                };
            }
            return { past: s.past, present: next, future: [] };
        });
    }, []);
    /** Replace the document without recording history (initial load, restore). */
    const reset = useCallback((next) => {
        lastPushRef.current = 0;
        setState({ past: [], present: next, future: [] });
    }, []);
    const undo = useCallback(() => {
        lastPushRef.current = 0;
        setState((s) => {
            const previous = s.past[s.past.length - 1];
            if (previous === undefined)
                return s;
            return {
                past: s.past.slice(0, -1),
                present: previous,
                future: [s.present, ...s.future],
            };
        });
    }, []);
    const redo = useCallback(() => {
        lastPushRef.current = 0;
        setState((s) => {
            const next = s.future[0];
            if (next === undefined)
                return s;
            return {
                past: [...s.past, s.present],
                present: next,
                future: s.future.slice(1),
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
