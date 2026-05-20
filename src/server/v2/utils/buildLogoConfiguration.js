export function buildLogoConfiguration({ logoPosition, mainItems }) {
    if (logoPosition === 'inline') {
        return { hasInitialLogo: false, hasRightLogo: false, logoBlock: undefined, mainBlocks: mainItems };
    }

    const logoBlock = mainItems.find(item => item.type === 'logo' || item.type === 'image');
    const mainBlocks = mainItems.filter(item => item.type !== 'logo' && item.type !== 'image');

    return {
        hasInitialLogo: !!logoBlock && (logoPosition === 'left' || logoPosition === 'top'),
        hasRightLogo: !!logoBlock && logoPosition === 'right',
        logoBlock,
        mainBlocks
    };
}
