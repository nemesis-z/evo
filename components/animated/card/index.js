import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {animated} from 'react-spring';
import {use3dHover} from 'hooks';

import c from './index.scss';

const AnimatedCard = ({
    minWidth,
    children,
    className
}) => {
    const ref = useRef();
    const {
        onMove,
        onLeave,
        transform
    } = use3dHover(ref, {minWidth});
    const cn = classnames(c.animated_card, className);

    return (
        <animated.div ref={ref} className={cn} onMouseMove={onMove} onMouseLeave={onLeave} style={{transform}}>
            {children}
        </animated.div>
    );
};

AnimatedCard.propTypes = {
    minWidth: PropTypes.number,
    className: PropTypes.string,
    children: PropTypes.any.isRequired
};

export default AnimatedCard;
