import render from 'server/v2/render';

const mockLog = jest.fn();

const baseOptions = {
    style: {
        layout: 'text',
        logo: { type: 'primary', position: 'left' },
        text: { color: 'black', size: 12 }
    }
};

const baseV2Content = {
    meta: { offerCountry: 'US' },
    main_items: [{ type: 'text', content: 'Pay Later' }],
    action_items: [{ type: 'text', content: 'Learn more' }],
    disclaimer_items: [{ type: 'text', content: 'Subject to approval.' }]
};

describe('v2 render', () => {
    test('returns an HTML string', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    test('renders pp-message root element', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(result).toContain('class="pp-message"');
    });

    test('includes inline style tag', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(result).toContain('<style');
        expect(result).toContain('pp-message');
    });

    test('renders main_items text in .main span', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(result).toContain('Pay Later');
        expect(result).toMatch(/class="main[^"]*"/);
    });

    test('main span has aria-label', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(result).toMatch(/aria-label="[^"]+"/);
    });

    test('renders action_items in .action span', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(result).toContain('Learn more');
        expect(result).toMatch(/class="action[^"]*"/);
    });

    test('renders disclaimer_items appended to main content', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(result).toContain('Subject to approval.');
    });

    test('omits action span when action_items is empty', () => {
        const content = { ...baseV2Content, action_items: [] };
        const result = render(baseOptions, content, mockLog);
        expect(result).not.toMatch(/class="action[^"]*"/);
    });

    test('renders logo item as img in .logo span', () => {
        const content = {
            ...baseV2Content,
            main_items: [
                { type: 'logo', src: 'https://example.com/logo.svg', alt: 'PayPal' },
                { type: 'text', content: 'Pay Later' }
            ]
        };
        const result = render(baseOptions, content, mockLog);
        expect(result).toContain('https://example.com/logo.svg');
        expect(result).toMatch(/class="logo[^"]*"/);
        expect(result).toContain('role="img"');
    });

    test('positions logo on left by default', () => {
        const content = {
            ...baseV2Content,
            main_items: [
                { type: 'logo', src: 'https://example.com/logo.svg', alt: 'PayPal' },
                { type: 'text', content: 'Pay Later' }
            ]
        };
        const result = render(baseOptions, content, mockLog);
        expect(result).toMatch(/class="logo[^"]*left[^"]*"/);
    });

    test('positions logo on right when position is right', () => {
        const options = { style: { ...baseOptions.style, logo: { type: 'primary', position: 'right' } } };
        const content = {
            ...baseV2Content,
            main_items: [
                { type: 'text', content: 'Pay Later' },
                { type: 'logo', src: 'https://example.com/logo.svg', alt: 'PayPal' }
            ]
        };
        const result = render(options, content, mockLog);
        expect(result).toMatch(/class="logo[^"]*right[^"]*"/);
    });

    test('positions logo on top when position is top', () => {
        const options = { style: { ...baseOptions.style, logo: { type: 'primary', position: 'top' } } };
        const content = {
            ...baseV2Content,
            main_items: [
                { type: 'logo', src: 'https://example.com/logo.svg', alt: 'PayPal' },
                { type: 'text', content: 'Pay Later' }
            ]
        };
        const result = render(options, content, mockLog);
        expect(result).toMatch(/class="logo[^"]*top[^"]*"/);
    });

    test('inline logo type keeps logo in main blocks without a standalone logo span', () => {
        const options = { style: { ...baseOptions.style, logo: { type: 'inline', position: 'left' } } };
        const content = {
            ...baseV2Content,
            main_items: [
                { type: 'text', content: 'Pay Later' },
                { type: 'logo', src: 'https://example.com/logo.svg', alt: 'PayPal' }
            ]
        };
        const result = render(options, content, mockLog);
        // no standalone logo span — logo rendered inline within main blocks
        expect(result).not.toMatch(/role="img"/);
    });

    test('logo type none suppresses logo span even when logo item is present', () => {
        const options = { style: { ...baseOptions.style, logo: { type: 'none', position: 'left' } } };
        const content = {
            ...baseV2Content,
            main_items: [
                { type: 'logo', src: 'https://example.com/logo.svg', alt: 'PayPal' },
                { type: 'text', content: 'Pay Later' }
            ]
        };
        const result = render(options, content, mockLog);
        expect(result).not.toMatch(/role="img"/);
    });

    test('renders link item as an anchor tag', () => {
        const content = {
            ...baseV2Content,
            main_items: [{ type: 'link', content: 'Terms apply' }]
        };
        const result = render(baseOptions, content, mockLog);
        expect(result).toContain('<a');
        expect(result).toContain('Terms apply');
    });

    test('applies text color class to main span', () => {
        const options = { style: { ...baseOptions.style, text: { color: 'white' } } };
        const result = render(options, baseV2Content, mockLog);
        expect(result).toMatch(/class="main[^"]*white[^"]*"/);
    });

    test('handles empty main_items gracefully', () => {
        const content = { ...baseV2Content, main_items: [] };
        const result = render(baseOptions, content, mockLog);
        expect(typeof result).toBe('string');
    });

    test('handles missing v2Content fields gracefully', () => {
        const result = render(baseOptions, {}, mockLog);
        expect(typeof result).toBe('string');
        expect(result).toContain('class="pp-message"');
    });

    test('does not use v5 cascade structure', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(result).not.toContain('message__container');
        expect(result).not.toContain('message__headline');
        expect(result).not.toContain('message__foreground');
    });
});
