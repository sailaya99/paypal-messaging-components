import validOptions from './validOptions';
import { logInvalidOption, buildValidStyle } from '../validateStyle';

export default (addLog, style) => {
    if (style.layout === 'custom') {
        addLog(
            'Invalid option value (style.layout). The "custom" layout is not supported by renderV2Message; falling back to "text".'
        );
        return buildValidStyle(addLog, validOptions, { layout: 'text' });
    }

    if (validOptions[style.layout]) {
        return buildValidStyle(addLog, validOptions, style);
    }

    logInvalidOption(addLog, 'style.layout', Object.keys(validOptions), style.layout);
    return buildValidStyle(addLog, validOptions, { layout: 'text' });
};
