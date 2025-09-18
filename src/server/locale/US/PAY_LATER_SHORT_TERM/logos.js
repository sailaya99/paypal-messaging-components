const ROOT_URL = '/assets/logos/5.1/paylater';
const TYPES = ['COLOR', 'WHITE', 'BLACK', 'GRAYSCALE'];
const TYPE_MAP = { COLOR: 'fc', WHITE: 'wh', BLACK: 'mono', GRAYSCALE: 'grayscale' };
const getSvgSrc = svgFileName => `${ROOT_URL}/${svgFileName}.svg`;

const PRIMARY = TYPES.reduce(
    (object, type) => ({
        ...object,
        [type]: { dimensions: [131, 47], src: getSvgSrc(`paylater_${TYPE_MAP[type]}_pri`) }
    }),
    {}
);

const ALTERNATIVE = TYPES.reduce(
    (object, type) => ({
        ...object,
        [type]: { dimensions: [32, 32], src: getSvgSrc(`paylater_${TYPE_MAP[type]}_alt`) }
    }),
    {}
);

// Define flex logo mutations for PAY_LATER_SHORT_TERM
export const flexLogoMutations = [
    ['color:gray', { logo: PRIMARY.COLOR }],
    ['color:white', { logo: PRIMARY.COLOR }],
    ['color:monochrome', { logo: PRIMARY.MONOCHROME }],
    ['color:grayscale', { logo: PRIMARY.GRAYSCALE }]
];

// Define text logo mutations for PAY_LATER_SHORT_TERM
export const textLogoMutations = [
    ['text.color:white && logo.type:primary', { logo: PRIMARY.WHITE }],
    ['text.color:grayscale && logo.type:primary', { logo: PRIMARY.GRAYSCALE }],
    ['text.color:monochrome && logo.type:primary', { logo: PRIMARY.MONOCHROME }],

    ['text.color:white && logo.type:alternative', { logo: ALTERNATIVE.WHITE }],
    ['text.color:grayscale && logo.type:alternative', { logo: ALTERNATIVE.GRAYSCALE }],
    ['text.color:monochrome && logo.type:alternative', { logo: ALTERNATIVE.MONOCHROME }],

    ['text.color:white && logo.type:inline', { logo: ALTERNATIVE.WHITE }],
    ['text.color:grayscale && logo.type:inline', { logo: ALTERNATIVE.GRAYSCALE }],
    ['text.color:monochrome && logo.type:inline', { logo: ALTERNATIVE.MONOCHROME }]
];

export default {
    PRIMARY,
    ALTERNATIVE,
    // Export logo mutations for flex layouts
    flexLogoMutations,
    textLogoMutations
};
