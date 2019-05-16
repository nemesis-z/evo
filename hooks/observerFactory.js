import {
    useRef,
    useEffect
} from 'react';

export default ({
    cb,
    ref,
    map,
    opts,
    observer
}) => {
    const isCleaned = useRef(false);
    const _opts = {...opts, cb};
    const clean = () => {
        const item = ref.current;

        isCleaned.current = true;
        if (map.has(item)) {
            map.delete(item);
            observer.unobserve(item);
        }
    };

    useEffect(() => {
        const item = ref.current;

        if (item && map.has(item)) {
            map.set(ref.current, _opts);
        }
    });
    useEffect(() => {
        const item = ref.current;

        if (!item || isCleaned.current) {
            return null;
        }

        map.set(item, _opts);
        observer.observe(item);

        return clean;
    }, []);

    return clean;
};
