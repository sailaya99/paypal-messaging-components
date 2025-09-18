import validOptions from './validOptions';
import getMutations from './mutations';
import defaultLogos from '../../../message/logos';
import customLogos from './logos';
import styles from './styles';

export default {
    localeClass: 'locale--US',
    productName: ['with', 'PayPal.'],
    validOptions,
    getMutations,
    logos: customLogos || defaultLogos,
    styles
};
