const DEFAULT_FONT_FAMILY = '"PayPal Pro", Helvetica, Arial, "Liberation Sans", sans-serif';
const FONT_FALLBACKS = 'Helvetica, Arial, "Liberation Sans", sans-serif';
const GENERIC_FONT_FAMILIES = new Set([
    'serif',
    'sans-serif',
    'monospace',
    'cursive',
    'fantasy',
    'system-ui',
    'ui-serif',
    'ui-sans-serif',
    'ui-monospace'
]);

const isSafeFontName = value => typeof value === 'string' && /^[\w\s-]+$/.test(value.trim());
const isSafeFontSource = value => typeof value === 'string' && /^https:\/\/[^'")\s]+$/i.test(value);

function formatFontFamilyName(value) {
    if (GENERIC_FONT_FAMILIES.has(value)) {
        return value;
    }

    return `'${value}'`;
}

export default ({ fontFamily, fontSource, fontSize = 12, textAlign = 'left' } = {}) => {
    const sources = Array.isArray(fontSource) ? fontSource.filter(isSafeFontSource) : [];
    const families = Array.isArray(fontFamily) ? fontFamily.filter(isSafeFontName).map(formatFontFamilyName) : [];

    const fontFaceRules = sources
        .map((url, i) => `@font-face { font-family: 'PP Merchant Font ${i + 1}'; src: url('${url}'); }`)
        .join('\n');

    const customSourceNames = sources.map((_, i) => `'PP Merchant Font ${i + 1}'`);

    let effectiveFontFamily;
    if (customSourceNames.length > 0 || families.length > 0) {
        const parts = [...customSourceNames, ...families, FONT_FALLBACKS];
        effectiveFontFamily = parts.join(', ');
    } else {
        effectiveFontFamily = DEFAULT_FONT_FAMILY;
    }

    return `${fontFaceRules ? `${fontFaceRules}\n` : ''}
body {
    margin: 0;
    padding: 0;
}

.pp-message {
    display: block;
    width: 100%;
    font-family: ${effectiveFontFamily};
    font-weight: 450;
    font-size: ${fontSize}px;
    text-align: ${textAlign};
}

.pp-message .main { vertical-align: middle; }
.pp-message .main.black { color: #000; }
.pp-message .main.monochrome { color: #000; }
.pp-message .main.grayscale { color: #000; }
.pp-message .main.white { color: #fff; }

.pp-message .action [data-iframe-url] {
    color: #0070ba;
    white-space: nowrap;
}
.pp-message .action {
    margin-left: 0.25em;
    vertical-align: middle;
}
.pp-message .action.monochrome > [data-iframe-url] { color: #000; }
.pp-message .action.grayscale > [data-iframe-url] { color: #000; }
.pp-message .action.white > [data-iframe-url] { color: #fff; }

.pp-message .logo { display: inline-block; vertical-align: middle; }
.pp-message .logo.top { display: block; vertical-align: initial; }

.pp-message img {
    max-height: 1.25em;
    height: 1.25em;
    width: auto;
    vertical-align: middle;
    margin-right: 0.3125em;
}
.pp-message .logo.right img {
    margin-right: 0;
    margin-left: 0.3125em;
}
.pp-message .logo.top img {
    margin-right: 0;
    margin-bottom: 0.3125em;
}

.pp-message .logo.white img { filter: brightness(0) invert(1); }
.pp-message .logo.monochrome img { filter: grayscale(100%) brightness(0); }
.pp-message .logo.grayscale img { filter: grayscale(100%); }
`;
};
