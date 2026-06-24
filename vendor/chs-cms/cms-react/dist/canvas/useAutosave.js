import { useCallback, useEffect, useRef, useState } from 'react';
/**
 * Debounced autosave with an explicit `flush` (used by Cmd+S and Publish).
 * Tracks dirtiness against the last successfully saved snapshot.
 */
export function useAutosave({ content, ready, valid, save, delayMs = 1500, }) {
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const [savedJson, setSavedJson] = useState(null);
    const contentRef = useRef(content);
    contentRef.current = content;
    const validRef = useRef(valid);
    validRef.current = valid;
    const savedJsonRef = useRef(null);
    const inFlightRef = useRef(null);
    const saveRef = useRef(save);
    saveRef.current = save;
    const contentJson = JSON.stringify(content);
    const dirty = ready && savedJson !== null && contentJson !== savedJson;
    /** Mark the given snapshot as the saved baseline (after initial load). */
    const markSaved = useCallback((snapshot) => {
        const json = JSON.stringify(snapshot);
        savedJsonRef.current = json;
        setSavedJson(json);
        setStatus('idle');
        setError(null);
    }, []);
    /** Save now if dirty. Resolves true when the document is fully persisted. */
    const flush = useCallback(async () => {
        if (inFlightRef.current)
            await inFlightRef.current;
        const snapshot = contentRef.current;
        const json = JSON.stringify(snapshot);
        if (json === savedJsonRef.current)
            return true;
        if (!validRef.current) {
            setStatus('error');
            setError('Fix the highlighted errors to save');
            return false;
        }
        setStatus('saving');
        setError(null);
        const attempt = saveRef
            .current(snapshot)
            .then((result) => {
            if (result.ok) {
                savedJsonRef.current = json;
                setSavedJson(json);
                setStatus('saved');
                return true;
            }
            setStatus('error');
            setError(result.error);
            return false;
        })
            .catch(() => {
            setStatus('error');
            setError('Save failed — check your connection');
            return false;
        })
            .finally(() => {
            inFlightRef.current = null;
        });
        inFlightRef.current = attempt;
        return attempt;
    }, []);
    useEffect(() => {
        if (!ready || !dirty || !valid)
            return;
        const timer = setTimeout(() => {
            void flush();
        }, delayMs);
        return () => clearTimeout(timer);
    }, [contentJson, ready, dirty, valid, delayMs, flush]);
    return { status, error, dirty, flush, markSaved };
}
