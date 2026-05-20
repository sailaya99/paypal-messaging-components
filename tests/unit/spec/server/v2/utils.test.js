import { mapClasses } from 'server/v2/utils/mapClasses';
import { buildContentLabel } from 'server/v2/utils/buildContentLabel';
import { buildLogoConfiguration } from 'server/v2/utils/buildLogoConfiguration';

describe('mapClasses', () => {
    test('joins truthy entries as space-separated string', () => {
        expect(mapClasses({ main: true, left: true, black: true })).toBe('main left black');
    });

    test('excludes falsy entries', () => {
        expect(mapClasses({ main: true, right: false, black: true })).toBe('main black');
    });

    test('lowercases and replaces underscores with dashes', () => {
        expect(mapClasses({ LOGO_TYPE: true })).toBe('logo-type');
    });

    test('excludes empty string keys', () => {
        expect(mapClasses({ '': true, main: true })).toBe('main');
    });

    test('returns empty string when all entries are falsy', () => {
        expect(mapClasses({ main: false, action: false })).toBe('');
    });
});

describe('buildContentLabel', () => {
    test('joins content fields from text items', () => {
        const items = [
            { type: 'text', content: 'Pay Later' },
            { type: 'text', content: 'with PayPal' }
        ];
        expect(buildContentLabel(items)).toBe('Pay Later with PayPal');
    });

    test('uses alt field for image items', () => {
        const items = [
            { type: 'logo', alt: 'PayPal logo' },
            { type: 'text', content: 'Pay Later' }
        ];
        expect(buildContentLabel(items)).toBe('PayPal logo Pay Later');
    });

    test('filters empty content', () => {
        const items = [
            { type: 'text', content: '' },
            { type: 'text', content: 'Pay Later' }
        ];
        expect(buildContentLabel(items)).toBe('Pay Later');
    });

    test('trims whitespace from each item', () => {
        const items = [{ type: 'text', content: '  Pay Later  ' }];
        expect(buildContentLabel(items)).toBe('Pay Later');
    });

    test('returns empty string for empty array', () => {
        expect(buildContentLabel([])).toBe('');
    });
});

describe('buildLogoConfiguration', () => {
    const logoItem = { type: 'logo', src: 'logo.svg' };
    const textItem = { type: 'text', content: 'Pay Later' };

    test('extracts logo block and filters from mainBlocks for left position', () => {
        const result = buildLogoConfiguration({ logoPosition: 'left', mainItems: [logoItem, textItem] });
        expect(result.logoBlock).toBe(logoItem);
        expect(result.mainBlocks).toEqual([textItem]);
        expect(result.hasInitialLogo).toBe(true);
        expect(result.hasRightLogo).toBe(false);
    });

    test('sets hasRightLogo for right position', () => {
        const result = buildLogoConfiguration({ logoPosition: 'right', mainItems: [textItem, logoItem] });
        expect(result.hasRightLogo).toBe(true);
        expect(result.hasInitialLogo).toBe(false);
    });

    test('sets hasInitialLogo for top position', () => {
        const result = buildLogoConfiguration({ logoPosition: 'top', mainItems: [logoItem, textItem] });
        expect(result.hasInitialLogo).toBe(true);
        expect(result.hasRightLogo).toBe(false);
    });

    test('inline position keeps all items in mainBlocks', () => {
        const result = buildLogoConfiguration({ logoPosition: 'inline', mainItems: [logoItem, textItem] });
        expect(result.mainBlocks).toEqual([logoItem, textItem]);
        expect(result.hasInitialLogo).toBe(false);
        expect(result.hasRightLogo).toBe(false);
        expect(result.logoBlock).toBeUndefined();
    });

    test('handles image type same as logo type', () => {
        const imageItem = { type: 'image', src: 'logo.png' };
        const result = buildLogoConfiguration({ logoPosition: 'left', mainItems: [imageItem, textItem] });
        expect(result.logoBlock).toBe(imageItem);
        expect(result.mainBlocks).toEqual([textItem]);
    });

    test('returns no logo block when no logo items present', () => {
        const result = buildLogoConfiguration({ logoPosition: 'left', mainItems: [textItem] });
        expect(result.logoBlock).toBeUndefined();
        expect(result.hasInitialLogo).toBe(false);
        expect(result.mainBlocks).toEqual([textItem]);
    });
});
