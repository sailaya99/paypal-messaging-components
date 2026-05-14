/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from 'preact';

import { objectMerge, objectFlattenToArray, curry } from '../../utils/server';
import allStyles from '../message/styles';
import Styles from '../message/parts/Styles';
import { getFontRules } from '../message/font';

const DEFAULT_FONT_SIZE = 12;

const applyCascade = curry((style, flattened, type, rules) =>
    rules.reduce(
        (accumulator, [key, val]) => {
            const split = key.split(' && ');
            if (key === 'default' || split.every(k => flattened.includes(k))) {
                const calculatedVal =
                    typeof val === 'function'
                        ? val({ textSize: (style.text?.size ?? DEFAULT_FONT_SIZE) * 0.983 })
                        : val;
                return type === Array ? [...accumulator, calculatedVal] : objectMerge(accumulator, calculatedVal);
            }
            return accumulator;
        },
        type === Array ? [] : {}
    )
);

const renderItem = item => {
    if (!item) return null;
    const { type, content, src, dimensions, alt } = item;

    if (type === 'logo' || type === 'image') {
        const [width, height] = dimensions || [0, 0];
        return (
            <div className="message__logo-container" aria-hidden="true">
                <div className="message__logo message__logo--svg">
                    <img src={src} alt={alt || ''} role="presentation" />
                    <canvas height={height} width={width} />
                </div>
            </div>
        );
    }

    // eslint-disable-next-line react/no-danger
    return <span dangerouslySetInnerHTML={{ __html: content || '' }} />;
};

export default ({ options, v2Content }) => {
    const { style } = options;
    const { layout } = style;

    const mainItems = v2Content?.main_items ?? [];
    const actionItems = v2Content?.action_items ?? [];
    const disclaimerItems = v2Content?.disclaimer_items ?? [];
    const offerCountry = v2Content?.meta?.offerCountry ?? 'US';

    const localeClass = `locale--${offerCountry}`;
    const layoutProp = `layout:${layout}`;

    const styleSelectors = objectFlattenToArray(style);
    const applyCascadeRules = applyCascade(style, styleSelectors);

    const globalStyleRules = applyCascadeRules(Array, allStyles[layoutProp] ?? []);
    const customFontStyleRules = getFontRules(style);

    const logoItem = mainItems.find(item => item.type === 'logo' || item.type === 'image');
    const textItems = mainItems.filter(item => item.type !== 'logo' && item.type !== 'image');

    const logoType = logoItem ? style.logo?.type ?? 'primary' : 'none';

    return (
        <div className="message">
            <Styles
                globalStyleRules={globalStyleRules}
                localeStyleRules={[]}
                mutationStyleRules={[]}
                miscStyleRules={[]}
                customFontStyleRules={customFontStyleRules}
            />
            <div className={`message__container ${localeClass}`}>
                <div className="message__foreground" />
                <div className="message__content">
                    {logoType !== 'none' && logoType !== 'inline' && logoItem ? renderItem(logoItem) : null}
                    <div className="message__messaging">
                        <div className="message__promo-container">
                            <div className="message__headline">
                                {textItems.map((item, idx) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <Fragment key={idx}>{renderItem(item)}</Fragment>
                                ))}
                                {logoType === 'inline' && logoItem ? <> {renderItem(logoItem)}</> : null}
                            </div>
                            {actionItems.length > 0 ? (
                                <div className="message__sub-headline">
                                    {actionItems.map((item, idx) => (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <Fragment key={idx}>{renderItem(item)}</Fragment>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                        {disclaimerItems.length > 0 ? (
                            <p className="message__disclaimer">
                                {disclaimerItems.map((item, idx) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <Fragment key={idx}>{renderItem(item)}</Fragment>
                                ))}
                            </p>
                        ) : null}
                    </div>
                </div>
                <div className="message__background" />
            </div>
        </div>
    );
};
