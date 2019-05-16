import ResizeObserver from 'resize-observer-polyfill';

import observerFactory from './observerFactory';

const map = new Map();
const observer = process.env.TARGET === 'web' ? new ResizeObserver((entries) => {
    entries.forEach((entry) => {
        try {
            map.get(entry.target).cb(entry);
        } catch(_) {} // eslint-disable-line
    });
}) : undefined;

export default (ref, cb) => observerFactory({cb, ref, map, observer});
