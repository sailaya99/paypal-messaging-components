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
        case 'logo':
        case 'image':
            return <img src={item.src} alt={item.alt || 'PayPal'} />;
        case 'link':
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            return <a href="#">{item.content}</a>;
        case 'text':
        default:
            return item.content;
    }
}

export default function V2Message({ options, v2Content }) {
    const { style } = options;
    const logoPosition = style.logo?.type === 'inline' ? 'inline' : style.logo?.position ?? 'left';
    const logoType = style.logo?.type ?? 'primary';
    const textColor = style.text?.color ?? 'black';

    const mainItems = v2Content?.main_items ?? [];
    const actionItems = v2Content?.action_items ?? [];
    const disclaimerItems = v2Content?.disclaimer_items ?? [];

    const { logoBlock, hasInitialLogo, hasRightLogo, mainBlocks } = buildLogoConfiguration({
        logoPosition,
        mainItems
    });

    const preparedMainBlocks =
        disclaimerItems.length > 0 ? [...mainBlocks, { type: 'text', content: ' ' }, ...disclaimerItems] : mainBlocks;

    const logoClasses = mapClasses({ logo: true, [textColor]: true, [logoPosition]: true, [logoType]: true });
    const mainClasses = mapClasses({ main: true, [logoPosition]: true, [textColor]: true });
    const actionClasses = mapClasses({ action: true, [textColor]: true });

    const mainLabel = buildContentLabel(preparedMainBlocks);
    const actionLabel = buildContentLabel(actionItems);

    return (
        <div className="pp-message">
            {/* eslint-disable-next-line react/no-danger */}
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            {hasInitialLogo && logoBlock && logoType !== 'none' ? (
                <span role="img" aria-label={logoBlock.alt || 'PayPal'} className={logoClasses}>
                    {renderBlock(logoBlock)}
                </span>
            ) : null}
            <span aria-label={mainLabel} className={mainClasses}>
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
            {hasRightLogo && logoBlock && logoType !== 'none' ? (
                <span role="img" aria-label={logoBlock.alt || 'PayPal'} className={logoClasses}>
                    {renderBlock(logoBlock)}
                </span>
            ) : null}
        </div>
    );
}
