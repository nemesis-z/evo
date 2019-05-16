const callbacks = {};
const events = {};

export default (event, cb) => {
    if (!cb || process.env.TARGET !== 'web') {
        return null;
    }

    const id = `listener_${Math.round(Math.random() * 10000)}`;

    let isCleaned = false;

    if (!callbacks.hasOwnProperty(event)) {
        callbacks[event] = {};
    }

    if (!events.hasOwnProperty(event)) {
        events[event] = (e) => {
            for (const key in callbacks[event]) {
                if (callbacks[event].hasOwnProperty(key)) {
                    callbacks[event][key](e);
                }
            }
        };

        if (window.addEventListener) {
            window.addEventListener(event, events[event]);
        } else {
            window.attachEvent(`on${event}`, events[event]);
        }
    }

    callbacks[event][id] = cb;

    return () => {
        if (isCleaned) {
            return;
        }

        isCleaned = true;
        delete callbacks[event][id];

        for (const key in callbacks[event]) {
            if (callbacks[event].hasOwnProperty(key)) {
                return;
            }
        }

        if (window.removeEventListener) {
            window.removeEventListener(event, events[event]);
        } else {
            window.detachEvent(`on${event}`, events[event]);
        }

        delete callbacks[event];
        delete events[event];
    };
};
