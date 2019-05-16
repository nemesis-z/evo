import React, {
    useRef,
    useEffect
} from 'react';
import PropTypes from 'prop-types';
import {
    useSpring,
    animated
} from 'react-spring';

import {useResizeObserver} from 'hooks';

import c from './index.scss';

const AnimatedHeight = ({
    config,
    children,
    extra = 0
}) => {
    const ref = useRef();
    const [style, setStyle] = useSpring(() => ({height: 0, config}));
    const onHeightChange = () => requestAnimationFrame(() => {
        if (ref.current) {
            const offsetHeight = ref.current.offsetHeight;

            setStyle({height: offsetHeight ? offsetHeight + extra : 0});
        }
    });

    useEffect(() => void onHeightChange(), []);

    useResizeObserver(ref, onHeightChange);

    return (
        <animated.div style={style} className={c.animated_height}>
            <div ref={ref}>
                {children}
            </div>
        </animated.div>
    );
};

AnimatedHeight.propTypes = {
    extra: PropTypes.number,
    config: PropTypes.object,
    children: PropTypes.any.isRequired
};

export default AnimatedHeight;
