/** @jsx h */
/** @jsxFrag Fragment */
import { h, Fragment } from 'preact';

import { buildContentLabel } from './utils/buildContentLabel';
import { buildLogoConfiguration } from './utils/buildLogoConfiguration';
import { mapClasses } from './utils/mapClasses';
import styles from './styles';

function renderBlock(item) {
    if (!item) return null;
    switch (item.type) {
        case 'IMAGE':
            return <img src={item.source_url} alt={item.alternative_text || 'PayPal'} />;
        case 'LINK':
            return (
                <span
                    data-iframe-url={item.click_url}
                    data-embeddable={item.embeddable !== undefined ? String(item.embeddable) : undefined}
                >
                    {item.text}
                </span>
            );
        case 'TEXT':
        default:
            return item.text;
    }
}

function renderLogo(block, className) {
    if (!block) return null;
    return (
        <span role="img" aria-label={block.alternative_text || 'PayPal'} className={className}>
            {renderBlock(block)}
        </span>
    );
}

function FlexMessage({ style, v2Content }) {
    const color = style.color ?? 'black';
    const ratio = style.ratio ?? '8x1';

    const mainItems = v2Content?.main_items ?? [];
    const actionItems = v2Content?.action_items ?? [];
    const disclaimerItems = v2Content?.disclaimer_items ?? [];

    const logoBlock = mainItems.find(item => item.type === 'IMAGE');
    const mainBlocks = mainItems.filter(item => item.type !== 'IMAGE');

    const mainLabel = buildContentLabel(mainBlocks);
    const actionLabel = buildContentLabel(actionItems);

    return (
        <div
            className={`pp-message pp-flex ${color} r-${ratio}`}
            data-pp-style-layout="flex"
            data-pp-style-color={color}
            data-pp-style-ratio={ratio}
        >
            {/* eslint-disable react/no-danger */}
            <style
                dangerouslySetInnerHTML={{
                    __html: styles({
                        layout: 'flex',
                        fontFamily: style.text?.fontFamily,
                        fontSource: style.text?.fontSource
                    })
                }}
            />
            {/* eslint-enable react/no-danger */}
            <div className="pp-flex__background" />
            <div className="pp-flex__content">
                {logoBlock ? (
                    <div className="pp-flex__logo-container">
                        <span role="img" aria-label={logoBlock.alternative_text || 'PayPal'} className="pp-flex__logo">
                            {renderBlock(logoBlock)}
                        </span>
                    </div>
                ) : null}
                <div className="pp-flex__messaging">
                    <div aria-label={mainLabel} className="pp-flex__main">
                        {mainBlocks.map((item, idx) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Fragment key={idx}>{renderBlock(item)}</Fragment>
                        ))}
                    </div>
                    {actionItems.length > 0 ? (
                        <div aria-label={actionLabel} className="pp-flex__action">
                            {actionItems.map((item, idx) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <Fragment key={idx}>{renderBlock(item)}</Fragment>
                            ))}
                        </div>
                    ) : null}
                    {disclaimerItems.length > 0 ? (
                        <div className="pp-flex__disclaimer">
                            {disclaimerItems.map((item, idx) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <Fragment key={idx}>{renderBlock(item)}</Fragment>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default function V2Message({ options, v2Content }) {
    const { style } = options;

    if (style.layout === 'flex') {
        return <FlexMessage style={style} v2Content={v2Content} />;
    }

    const logoType = style.logo?.type ?? 'primary';
    const logoPosition = style.logo?.position ?? 'left';
    const textColor = style.text?.color ?? 'black';

    const mainItems = v2Content?.main_items ?? [];
    const actionItems = v2Content?.action_items ?? [];
    const disclaimerItems = v2Content?.disclaimer_items ?? [];

    const { logoBlock, hasInitialLogo, hasRightLogo, mainBlocks } = buildLogoConfiguration({
        logoType,
        logoPosition,
        mainItems
    });

    const preparedMainBlocks =
        disclaimerItems.length > 0 ? [...mainBlocks, { type: 'TEXT', text: ' ' }, ...disclaimerItems] : mainBlocks;

    const logoClasses = mapClasses({ logo: true, [textColor]: true, [logoPosition]: true, [logoType]: true });
    const mainClasses = mapClasses({ main: true, [logoPosition]: true, [textColor]: true });
    const actionClasses = mapClasses({ action: true, [textColor]: true });

    const mainLabel = buildContentLabel(preparedMainBlocks);
    const actionLabel = buildContentLabel(actionItems);

    return (
        <div
            className="pp-message"
            data-pp-style-layout={style.layout}
            data-pp-style-logo-position={logoPosition}
            data-pp-style-logo-type={logoType}
            data-pp-style-text-align={style.text?.align}
            data-pp-style-text-color={textColor}
            data-pp-style-text-size={style.text?.size}
        >
            {/* eslint-disable react/no-danger */}
            <style
                dangerouslySetInnerHTML={{
                    __html: styles({
                        fontFamily: style.text?.fontFamily,
                        fontSource: style.text?.fontSource,
                        fontSize: style.text?.size,
                        textAlign: style.text?.align
                    })
                }}
            />
            {/* eslint-enable react/no-danger */}
            {hasInitialLogo && logoType !== 'none' ? renderLogo(logoBlock, logoClasses) : null}
            <span aria-label={mainLabel} className={mainClasses}>
                {logoType === 'inline' ? renderLogo(logoBlock, logoClasses) : null}
                {preparedMainBlocks.map((item, idx) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Fragment key={idx}>{renderBlock(item)}</Fragment>
                ))}
            </span>
            {actionItems.length > 0 ? (
                <span aria-label={actionLabel} className={actionClasses}>
                    {actionItems.map((item, idx) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Fragment key={idx}>{renderBlock(item)}</Fragment>
                    ))}
                </span>
            ) : null}
            {hasRightLogo && logoType !== 'none' ? renderLogo(logoBlock, logoClasses) : null}
        </div>
    );
}
