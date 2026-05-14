import render from 'server/v2/render';

jest.mock('server/message/styles', () => ({
    __esModule: true,
    default: {
        'layout:text': [['default', '.message { display: block; }']],
        'layout:flex': [['default', '.message { display: flex; }']]
    }
}));

const mockLog = jest.fn();

const baseOptions = {
    style: {
        layout: 'text',
        logo: { type: 'primary', position: 'left' },
        text: { size: 12 }
    }
};

const baseV2Content = {
    meta: { offerCountry: 'US' },
    main_items: [{ type: 'text', content: 'Pay Later' }],
    action_items: [{ type: 'text', content: 'Learn more' }],
    disclaimer_items: [{ type: 'text', content: 'Subject to approval.' }]
};

describe('v2 render', () => {
    beforeEach(() => {
        mockLog.mockClear();
    });

    test('returns an HTML string', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    test('renders main_items text content', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(result).toContain('Pay Later');
    });

    test('renders action_items content', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(result).toContain('Learn more');
    });

    test('renders disclaimer_items content', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(result).toContain('Subject to approval.');
    });

    test('renders message container structure', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(result).toContain('class="message"');
        expect(result).toContain('message__container');
        expect(result).toContain('message__content');
    });

    test('includes locale class from meta.offerCountry', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(result).toContain('locale--US');
    });

    test('uses GB locale class when offerCountry is GB', () => {
        const content = { ...baseV2Content, meta: { offerCountry: 'GB' } };
        const result = render(baseOptions, content, mockLog);
        expect(result).toContain('locale--GB');
    });

    test('renders logo item for type logo', () => {
        const content = {
            ...baseV2Content,
            main_items: [
                { type: 'logo', src: 'https://example.com/logo.svg', dimensions: [60, 20], alt: 'PayPal' },
                { type: 'text', content: 'Pay Later' }
            ]
        };
        const result = render(baseOptions, content, mockLog);
        expect(result).toContain('message__logo-container');
        expect(result).toContain('https://example.com/logo.svg');
    });

    test('renders inline logo inline with text', () => {
        const options = { style: { ...baseOptions.style, logo: { type: 'inline' } } };
        const content = {
            ...baseV2Content,
            main_items: [
                { type: 'text', content: 'Pay Later' },
                { type: 'logo', src: 'https://example.com/logo.svg', dimensions: [60, 20] }
            ]
        };
        const result = render(options, content, mockLog);
        expect(result).toContain('message__logo-container');
    });

    test('handles empty main_items gracefully', () => {
        const content = { ...baseV2Content, main_items: [] };
        const result = render(baseOptions, content, mockLog);
        expect(typeof result).toBe('string');
    });

    test('omits action_items section when empty', () => {
        const content = { ...baseV2Content, action_items: [] };
        const result = render(baseOptions, content, mockLog);
        expect(result).not.toContain('class="message__sub-headline"');
    });

    test('omits disclaimer section when empty', () => {
        const content = { ...baseV2Content, disclaimer_items: [] };
        const result = render(baseOptions, content, mockLog);
        expect(result).not.toContain('class="message__disclaimer"');
    });

    test('handles missing v2Content fields gracefully', () => {
        const result = render(baseOptions, {}, mockLog);
        expect(typeof result).toBe('string');
    });

    test('renders flex layout', () => {
        const options = { style: { layout: 'flex', color: 'blue', ratio: '8x1' } };
        const result = render(options, baseV2Content, mockLog);
        expect(result).toContain('class="message"');
    });
});
