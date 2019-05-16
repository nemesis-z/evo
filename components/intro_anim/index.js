import React, {
    useRef,
    useEffect
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {DELAY} from 'cobra/common';
import {useIntersectionObserver} from 'hooks';

import c from './index.scss';

let last = 0;

const IntroAnim = ({
    to,
    from,
    duration,
    tag: Tag,
    children,
    threshold,
    className
}) => {
    const ref = useRef();
    const timeout = useRef();
    const mounted = useRef(true);
    const styleRef = useRef({
        ...from,
        willChange: Object.keys(from).join(', '),
        transition: Object.keys(from).map((k) => `${k} ${duration}ms ease-out`).join(', ')
    });
    const style = {...styleRef.current};

    useIntersectionObserver(ref, () => {
        const target = ref.current;
        const now = Date.now();
        const delay = Math.max(0, last - now);

        last = Math.max(last, now) + DELAY;

        if (!target) {
            isDev && console.error('target not found');
            return void 0;
        }

        const onEnd = () => {
            if (!mounted.current) {
                return;
            }

            clearTimeout(timeout.current);
            target.removeEventListener('transitionend', onEnd);

            if ((to.transform || '').includes('3d')) {
                let ps = to.transform.match(/\d+[\w%]*/g);

                if (ps.length !== 4) {
                    isDev && console.error('Wrong transform pattern');
                    ps = new Array(4).fill('').map((_, i) => ps[i] || '');
                }

                if (ps[3][0] === '0') {
                    setTimeout(() => {
                        if (!mounted.current) {
                            return;
                        }

                        const t = ps[1][0] !== '0' || ps[2][0] !== '0' ? `translate(${ps[1]}, ${ps[2]})` : 'none';

                        target.style.willChange = 'auto';
                        target.style.transform = t;
                        styleRef.current.transform = t;
                    }, 5000);
                }
            }
        };

        return void setTimeout(() => {
            styleRef.current = {
                ...styleRef.current,
                ...to,
                willChange: 'auto'
            };
            timeout.current = setTimeout(onEnd, duration + 100);

            target.addEventListener('transitionend', onEnd);
            requestAnimationFrame(() => Object.entries(to).forEach(([key, value]) => void (target.style[key] = value)));
        }, delay);
    }, {threshold, once: true});
    useEffect(() => () => (mounted.current = false), []);

    return (
        <Tag className={classnames(c.intro_anim, className)} ref={ref} style={style}>
            {children}
        </Tag>
    );
};

IntroAnim.defaultProps = {
    tag: 'div',
    threshold: 0,
    duration: 500,
    to: {opacity: 1, transform: 'translate3d(0, 0, 0)'},
    from: {opacity: 0, transform: 'translate3d(0, -40px, 0)'}
};

IntroAnim.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    tag: PropTypes.string.isRequired,
    to: PropTypes.object.isRequired,
    from: PropTypes.object.isRequired,
    duration: PropTypes.number.isRequired,
    threshold: PropTypes.oneOf([0, 0.25, 0.5, 0.75, 1]).isRequired
};

export default IntroAnim;
