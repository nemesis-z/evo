import {useEffect} from 'react';

import observerFactory from './observerFactory';

const map = new Map();
const observer = process.env.TARGET === 'web' ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        try {
            const {
                target,
                isIntersecting,
                intersectionRect: rect,
                intersectionRatio: ratio
            } = entry;
            const {
                cb,
                once,
                threshold
            } = map.get(target);

            if (
                !isIntersecting && !once ||
                isIntersecting && (!threshold || ratio > threshold - 0.01 || ratio && !rect.top)
            ) {
                cb(entry);
                if (once) {
                    map.delete(target);
                    observer.unobserve(target);
                }
            }
        } catch(_) {} // eslint-disable-line
    });
}, {
    threshold: [0, 0.25, 0.5, 0.75, 1]
}) : undefined;

export default (ref, cb, opts = {}) => {
    const clean = observerFactory({cb, ref, opts, map, observer});

    useEffect(() => {
        setTimeout(() => {
            const item = ref.current;

            if (!item || !map.has(item)) {
                return;
            }

            const wh = window.innerHeight;
            const rect = item.getBoundingClientRect();
            const ratio = Math.min(1, (wh - rect.top) / rect.height);

            if (rect.top < 0 ? rect.top + rect.height > 0 : ratio > (opts.threshold || 0)) {
                cb({
                    isIntersecting: true,
                    boundingClientRect: rect
                });
                clean();
            }
        }, 0);
    }, []);
};
