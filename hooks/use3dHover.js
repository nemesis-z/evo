import {
    useRef,
    useState,
    useEffect,
    useCallback
} from 'react';
import {
    useSpring
} from 'react-spring';

import {getScrollTop} from 'utils';
import listen from 'utils/event_listeners';

const trans = (x, y, s) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s / 100})`;

export default (ref, {
    density = 4,
    scale = 102,
    minWidth = 0,
    config = {
        mass: 5,
        tension: 350,
        friction: 40
    }
} = {}) => {
    if (!ref) {
        if (process.env.NODE_ENV === 'development') {
            console.error('ref is not defined');
        }

        return {};
    }

    const endpoints = useRef({});
    const [canAnim, set] = useState(true);
    const [transform, setTransform] = useSpring(() => ({
        config,
        xys: [0, 0, 100]
    }));
    const onMove = useCallback(({pageX, pageY}) => {
        const {
            top,
            left,
            width,
            height
        } = endpoints.current;

        if (Object.values(endpoints.current).some((item) => item === undefined)) {
            return;
        }

        const x = pageX - left;
        const y = pageY - top;

        requestAnimationFrame(() => setTransform({
            xys: [(y / height - 0.5) * -density, (x / width - 0.5) * density, scale]
        }));
    }, [density]);
    const onLeave = useCallback(() => void requestAnimationFrame(() => setTransform({xys: [0, 0, 100]})), []);

    useEffect(() => {
        if (!ref.current) {
            return undefined;
        }

        const onResize = () => {
            if (window.innerWidth < minWidth) {
                return set(false);
            }

            const {
                top,
                left,
                width,
                height
            } = ref.current.getBoundingClientRect();

            endpoints.current = {
                left,
                width,
                height,
                top: top + getScrollTop()
            };

            return set(true);
        };

        onResize();
        return listen('resize', onResize);
    }, []);

    return canAnim ? {
        onMove,
        onLeave,
        transform: transform.xys.interpolate(trans)
    } : {};
};
