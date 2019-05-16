import get from 'lodash/get';
import queryString from 'query-string';

const supportedCache = {};

export const replace = (text, ...args) => args.reduce((acc, arg, index) => acc.replace(`%${index + 1}`, arg), text);

export const getScrollTop = () => (
    get(document, 'documentElement.scrollTop') || get(document, 'scrollingElement.scrollTop') || 0
);

export const getOuterHeight = (el, noAbsolute) => {
    const style = (window.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle) || {};

    if (noAbsolute && ['absolute', 'fixed'].includes(style.position)) {
        return 0;
    }

    return el.offsetHeight + (parseInt(style.marginTop, 10) || 0) + (parseInt(style.marginBottom, 10) || 0);
};

export const getWindowWidth = (dflt = 9999) => typeof window !== 'undefined' ? window.innerWidth : dflt;

export const isCSSPropSupported = (prop, {
    value,
    prefixed = true
} = {}) => {
    if (typeof document === 'undefined') {
        return true;
    }

    if (typeof prop !== 'string') {
        throw new Error('You can use only string to check if css prop supported');
    }

    if (supportedCache.hasOwnProperty(prop)) {
        return supportedCache[prop];
    }

    const props = [prop];
    const element = document.createElement('div');

    supportedCache[prop] = true;

    if (prop.indexOf('-') > 0) {
        props.push(prop.replace(/-([a-z])/g, (f) => f[1].toUpperCase()));
    }

    if (prefixed) {
        let last = props[props.length - 1];

        last = `${last.charAt(0).toUpperCase()}${last.slice(1)}`;

        ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'].forEach((prefix) => {
            props.push(`${prefix}${last}`);
        });
    }

    for (let i = 0; i < props.length; i++) {
        if (element.style[props[i]] !== undefined) {
            if (value) {
                element.style[props[i]] = value;
                return element.style[props[i]] === value;
            }

            return true;
        }
    }

    supportedCache[prop] = false;

    return false;
};
