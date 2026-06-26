import { buildFontRules } from '../message/font';

const DEFAULT_FONT_FAMILY = '"PayPal Pro", Helvetica, Arial, "Liberation Sans", sans-serif';
const FONT_FALLBACKS = 'Helvetica, Arial, "Liberation Sans", sans-serif';

function buildFontConfig({ fontFamily, fontSource }) {
    return buildFontRules({
        fontSource,
        fontFamily,
        fallbackStack: FONT_FALLBACKS,
        defaultFontFamily: DEFAULT_FONT_FAMILY,
        fontNamePrefix: 'PP Merchant Font'
    });
}

function flexStyles({ fontFamily, fontSource } = {}) {
    const { fontFaceRules, effectiveFontFamily } = buildFontConfig({ fontFamily, fontSource });
    const fontFaceBlock = fontFaceRules ? `${fontFaceRules}\n` : '';

    return `${fontFaceBlock}
body {
    height: 100%;
    margin: 0;
    padding: 0;
}

.pp-message.pp-flex {
    position: relative;
    width: 100%;
    height: 100%;
    font-family: ${effectiveFontFamily};
    font-weight: 300;
    cursor: pointer;
    box-sizing: border-box;
    overflow: hidden;
}

.pp-message.pp-flex .pp-flex__background,
.pp-message.pp-flex .pp-flex__content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
}

.pp-message.pp-flex .pp-flex__background {
    z-index: -1;
}

.pp-message.pp-flex.blue .pp-flex__background { background: #023188; }
.pp-message.pp-flex.blue .pp-flex__content { color: #fff; }
.pp-message.pp-flex.black .pp-flex__background { background: #000; }
.pp-message.pp-flex.black .pp-flex__content { color: #fff; }
.pp-message.pp-flex.white .pp-flex__background { background: #fff; }
.pp-message.pp-flex.white .pp-flex__content { color: #023187; border: 1px solid #009cde; }
.pp-message.pp-flex.white-no-border .pp-flex__background { background: #fff; }
.pp-message.pp-flex.white-no-border .pp-flex__content { color: #023187; }
.pp-message.pp-flex.gray .pp-flex__background { background: #eaeced; }
.pp-message.pp-flex.gray .pp-flex__content { color: #023187; }
.pp-message.pp-flex.monochrome .pp-flex__background { background: #fff; }
.pp-message.pp-flex.monochrome .pp-flex__content { color: #000; border: 1px solid #000; }
.pp-message.pp-flex.grayscale .pp-flex__background { background: #fff; }
.pp-message.pp-flex.grayscale .pp-flex__content { border: 1px solid #b7bcbf; }

.pp-message.pp-flex.blue .pp-flex__logo img,
.pp-message.pp-flex.black .pp-flex__logo img { filter: brightness(0) invert(1); }
.pp-message.pp-flex.monochrome .pp-flex__logo img { filter: grayscale(100%) brightness(0); }
.pp-message.pp-flex.grayscale .pp-flex__logo img { filter: grayscale(100%); }

.pp-message.pp-flex.r-1x1 .pp-flex__content,
.pp-message.pp-flex.r-1x4 .pp-flex__content {
    display: flex;
    flex-direction: column;
}

.pp-message.pp-flex.r-1x1 .pp-flex__content { padding: 7%; }
.pp-message.pp-flex.r-1x4 .pp-flex__content { padding: 8%; }
.pp-message.pp-flex.r-1x1 .pp-flex__logo-container { width: 50%; margin-bottom: 7%; }
.pp-message.pp-flex.r-1x4 .pp-flex__logo-container { width: 70%; margin-bottom: 12%; }
.pp-message.pp-flex.r-1x1 .pp-flex__messaging,
.pp-message.pp-flex.r-1x4 .pp-flex__messaging { flex: 1; }

.pp-message.pp-flex.r-1x1 .pp-flex__main {
    font-size: 10vw;
    line-height: 1.1em;
    font-weight: 400;
}
.pp-message.pp-flex.r-1x4 .pp-flex__main {
    font-size: 1.6rem;
    line-height: 1.3em;
    font-weight: 400;
}
.pp-message.pp-flex.r-1x1 .pp-flex__disclaimer { font-size: 9.5px; line-height: 1.1; }
.pp-message.pp-flex.r-1x4 .pp-flex__disclaimer { font-size: 0.75rem; line-height: 1.1; }

@media (min-width: 170px) {
    .pp-message.pp-flex.r-1x1 .pp-flex__main { font-size: 8vw; }
    .pp-message.pp-flex.r-1x1 .pp-flex__disclaimer { font-size: 5.5vw; }
}

@media (min-width: 220px) {
    .pp-message.pp-flex.r-1x1 .pp-flex__disclaimer { font-size: 4.5vw; }
}

.pp-message.pp-flex.r-8x1 .pp-flex__content,
.pp-message.pp-flex.r-20x1 .pp-flex__content {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-right: 1rem;
}

.pp-message.pp-flex.r-8x1 .pp-flex__logo-container,
.pp-message.pp-flex.r-20x1 .pp-flex__logo-container {
    flex: 0 0 33%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.pp-message.pp-flex.r-8x1 .pp-flex__logo img,
.pp-message.pp-flex.r-20x1 .pp-flex__logo img { width: 60%; }

.pp-message.pp-flex.r-8x1 .pp-flex__messaging,
.pp-message.pp-flex.r-20x1 .pp-flex__messaging {
    flex: 1 1 100%;
    display: block;
}

.pp-message.pp-flex.r-8x1 .pp-flex__main,
.pp-message.pp-flex.r-20x1 .pp-flex__main {
    font-size: 5vw;
    line-height: 1;
    margin-bottom: 0.2em;
    font-weight: 400;
}

.pp-message.pp-flex.r-8x1 .pp-flex__disclaimer,
.pp-message.pp-flex.r-20x1 .pp-flex__disclaimer {
    font-size: 10px;
    line-height: 1.1;
    display: inline;
}

@media (max-aspect-ratio: 61/10) and (min-width: 400px) {
    .pp-message.pp-flex.r-8x1 .pp-flex__logo-container,
    .pp-message.pp-flex.r-20x1 .pp-flex__logo-container { flex: 0 0 25%; }
    .pp-message.pp-flex.r-8x1 .pp-flex__main,
    .pp-message.pp-flex.r-20x1 .pp-flex__main { font-size: 4vw; margin-bottom: 0.5rem; }
}

@media (max-aspect-ratio: 61/10) and (min-width: 520px) {
    .pp-message.pp-flex.r-8x1 .pp-flex__disclaimer,
    .pp-message.pp-flex.r-20x1 .pp-flex__disclaimer { font-size: 0.85rem; }
}

@media (max-aspect-ratio: 61/10) and (min-width: 640px) {
    .pp-message.pp-flex.r-8x1 .pp-flex__main,
    .pp-message.pp-flex.r-20x1 .pp-flex__main { font-size: 1.7rem; }
}

@media (min-aspect-ratio: 200/11) {
    .pp-message.pp-flex.r-8x1 .pp-flex__logo-container,
    .pp-message.pp-flex.r-20x1 .pp-flex__logo-container { flex: 1 0 20%; }
    .pp-message.pp-flex.r-8x1 .pp-flex__logo img,
    .pp-message.pp-flex.r-20x1 .pp-flex__logo img { width: 50%; }
    .pp-message.pp-flex.r-8x1 .pp-flex__messaging,
    .pp-message.pp-flex.r-20x1 .pp-flex__messaging {
        flex: 1 1 85%;
        display: flex;
        align-items: center;
    }
    .pp-message.pp-flex.r-8x1 .pp-flex__main,
    .pp-message.pp-flex.r-20x1 .pp-flex__main { flex: 1 1 60%; font-size: 0.7rem; line-height: 1; }
    .pp-message.pp-flex.r-8x1 .pp-flex__disclaimer,
    .pp-message.pp-flex.r-20x1 .pp-flex__disclaimer { flex: 0 0 auto; font-size: 8px; line-height: 1.1; }
}

@media (min-aspect-ratio: 200/11) and (min-width: 400px) {
    .pp-message.pp-flex.r-8x1 .pp-flex__main,
    .pp-message.pp-flex.r-20x1 .pp-flex__main { font-size: 1rem; }
}

@media (min-aspect-ratio: 200/11) and (min-width: 600px) {
    .pp-message.pp-flex.r-8x1 .pp-flex__logo-container,
    .pp-message.pp-flex.r-20x1 .pp-flex__logo-container { flex: 1 0 10%; }
    .pp-message.pp-flex.r-8x1 .pp-flex__logo img,
    .pp-message.pp-flex.r-20x1 .pp-flex__logo img { width: 60%; }
    .pp-message.pp-flex.r-8x1 .pp-flex__main,
    .pp-message.pp-flex.r-20x1 .pp-flex__main { font-size: 1.8vw; }
    .pp-message.pp-flex.r-8x1 .pp-flex__disclaimer,
    .pp-message.pp-flex.r-20x1 .pp-flex__disclaimer { font-size: 0.75rem; }
}

@media (min-aspect-ratio: 200/11) and (min-width: 1000px) {
    .pp-message.pp-flex.r-8x1 .pp-flex__disclaimer,
    .pp-message.pp-flex.r-20x1 .pp-flex__disclaimer { font-size: 0.9rem; }
}
`;
}

function textStyles({ fontFamily, fontSource, fontSize = 12, textAlign = 'left' } = {}) {
    const { fontFaceRules, effectiveFontFamily } = buildFontConfig({ fontFamily, fontSource });

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
}

export default ({ layout = 'text', fontFamily, fontSource, fontSize, textAlign } = {}) => {
    if (layout === 'flex') {
        return flexStyles({ fontFamily, fontSource });
    }
    return textStyles({ fontFamily, fontSource, fontSize, textAlign });
};
