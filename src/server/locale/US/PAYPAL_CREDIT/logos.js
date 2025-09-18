// Old branding URL
// const ROOT_URL = 'https://www.paypalobjects.com/upstream/assets/logos/US';
// 5.1 branding URL - relative path to local assets
const ROOT_URL = '/assets/logos/5.1/credit';
const TYPES = ['COLOR', 'WHITE', 'BLACK', 'GRAYSCALE'];
const TYPE_MAP = { COLOR: 'fc', WHITE: 'wh', BLACK: 'mono', GRAYSCALE: 'grayscale' };
const getSvgSrc = svgFileName => `${ROOT_URL}/${svgFileName}.svg`;

const STACKED = TYPES.reduce(
    (object, type) => ({
        ...object,
        [type]: { dimensions: [315, 70], src: getSvgSrc(`ppc_${TYPE_MAP[type]}_pri`) }
    }),
    {}
);

const SINGLE_LINE = TYPES.reduce(
    (object, type) => ({
        ...object,
        [type]: { dimensions: [420, 64], src: getSvgSrc(`ppc_${TYPE_MAP[type]}_alt`) }
    }),
    {}
);

const SINGLE_LINE_NO_PAYPAL = TYPES.reduce(
    (object, type) => ({
        ...object,
        [type]: { dimensions: [350, 64], src: getSvgSrc(`ppc_${TYPE_MAP[type]}_alt_no_paypal`) }
    }),
    {}
);

const SINGLE_LINE_NO_PP = TYPES.reduce(
    (object, type) => ({
        ...object,
        [type]: { dimensions: [320, 60], src: getSvgSrc(`ppc_${TYPE_MAP[type]}_alt_noPP`) }
    }),
    {}
);

// Define flex logo mutations for PAYPAL_CREDIT
export const flexLogoMutations = [
    ['color:gray', { logo: STACKED.COLOR }],
    ['color:white', { logo: STACKED.COLOR }],
    ['color:monochrome', { logo: STACKED.MONOCHROME }],
    ['color:grayscale', { logo: STACKED.GRAYSCALE }]
];

// Define text logo mutations for PAYPAL_CREDIT
export const textLogoMutations = [
    ['text.color:white && logo.type:primary', { logo: STACKED.WHITE }],
    ['text.color:grayscale && logo.type:primary', { logo: STACKED.GRAYSCALE }],
    ['text.color:monochrome && logo.type:primary', { logo: STACKED.MONOCHROME }],

    ['text.color:white && logo.type:alternative', { logo: SINGLE_LINE.WHITE }],
    ['text.color:grayscale && logo.type:alternative', { logo: SINGLE_LINE.GRAYSCALE }],
    ['text.color:monochrome && logo.type:alternative', { logo: SINGLE_LINE.MONOCHROME }],

    ['text.color:white && logo.type:inline', { logo: SINGLE_LINE_NO_PP.WHITE }],
    ['text.color:grayscale && logo.type:inline', { logo: SINGLE_LINE_NO_PP.GRAYSCALE }],
    ['text.color:monochrome && logo.type:inline', { logo: SINGLE_LINE_NO_PP.MONOCHROME }]
];

export default {
    STACKED,
    SINGLE_LINE,
    SINGLE_LINE_NO_PP,
    SINGLE_LINE_NO_PAYPAL,
    // Alias clarified names to conventional ones for custom banner purposes
    PRIMARY: STACKED,
    ALTERNATIVE: SINGLE_LINE,
    ALT_NO_PAYPAL: SINGLE_LINE_NO_PAYPAL,
    ALT_NO_PP: SINGLE_LINE_NO_PP,
    // Export logo mutations for flex layouts
    flexLogoMutations,
    textLogoMutations
};
