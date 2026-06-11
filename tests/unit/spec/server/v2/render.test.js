import render from 'server/v2/render';
import validateStyle from 'server/v2/validateStyle';

const mockLog = jest.fn();

const baseOptions = {
    style: {
        layout: 'text',
        logo: { type: 'primary', position: 'left' },
        text: { color: 'black', size: 12 }
    }
};

const baseV2Content = {
    main_items: [{ type: 'TEXT', text: 'Pay Later' }],
    action_items: [{ type: 'LINK', text: 'Learn more', click_url: 'https://example.com/lander', embeddable: true }],
    disclaimer_items: [{ type: 'TEXT', text: 'Subject to approval.' }]
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

    test('renders IMAGE item as img in .logo span', () => {
        const content = {
            ...baseV2Content,
            main_items: [
                {
                    type: 'IMAGE',
                    source_url: 'https://example.com/logo.svg',
                    alternative_text: 'PayPal',
                    name: 'paypal_logo'
                },
                { type: 'TEXT', text: 'Pay Later' }
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
                {
                    type: 'IMAGE',
                    source_url: 'https://example.com/logo.svg',
                    alternative_text: 'PayPal',
                    name: 'paypal_logo'
                },
                { type: 'TEXT', text: 'Pay Later' }
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
                { type: 'TEXT', text: 'Pay Later' },
                {
                    type: 'IMAGE',
                    source_url: 'https://example.com/logo.svg',
                    alternative_text: 'PayPal',
                    name: 'paypal_logo'
                }
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
                {
                    type: 'IMAGE',
                    source_url: 'https://example.com/logo.svg',
                    alternative_text: 'PayPal',
                    name: 'paypal_logo'
                },
                { type: 'TEXT', text: 'Pay Later' }
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
                { type: 'TEXT', text: 'Pay Later' },
                {
                    type: 'IMAGE',
                    source_url: 'https://example.com/logo.svg',
                    alternative_text: 'PayPal',
                    name: 'paypal_logo'
                }
            ]
        };
        const result = render(options, content, mockLog);
        // no standalone logo span — logo rendered inline within main blocks
        expect(result).not.toMatch(/role="img"/);
    });

    test('logo type none suppresses logo span even when IMAGE item is present', () => {
        const options = { style: { ...baseOptions.style, logo: { type: 'none', position: 'left' } } };
        const content = {
            ...baseV2Content,
            main_items: [
                {
                    type: 'IMAGE',
                    source_url: 'https://example.com/logo.svg',
                    alternative_text: 'PayPal',
                    name: 'paypal_logo'
                },
                { type: 'TEXT', text: 'Pay Later' }
            ]
        };
        const result = render(options, content, mockLog);
        expect(result).not.toMatch(/role="img"/);
    });

    test('renders LINK item as a span with data attributes (not an anchor)', () => {
        const content = {
            ...baseV2Content,
            main_items: [
                { type: 'LINK', text: 'Terms apply', click_url: 'https://example.com/terms', embeddable: true }
            ]
        };
        const result = render(baseOptions, content, mockLog);
        expect(result).toContain('Terms apply');
        expect(result).toContain('data-iframe-url="https://example.com/terms"');
        expect(result).toContain('data-embeddable="true"');
        expect(result).not.toContain('<a');
    });

    test('omits data-embeddable when embeddable is not present on LINK item', () => {
        const content = {
            ...baseV2Content,
            main_items: [{ type: 'LINK', text: 'Terms apply', click_url: 'https://example.com/terms' }],
            action_items: []
        };
        const result = render(baseOptions, content, mockLog);
        expect(result).not.toContain('data-embeddable');
    });

    test('applies text color class to main span', () => {
        const options = { style: { ...baseOptions.style, text: { color: 'white' } } };
        const result = render(options, baseV2Content, mockLog);
        expect(result).toMatch(/class="main[^"]*white[^"]*"/);
    });

    test('greyscale alias normalizes to grayscale class after validation', () => {
        const raw = {
            layout: 'text',
            logo: { type: 'primary', position: 'left' },
            text: { color: 'greyscale', size: 12 }
        };
        const validatedStyle = validateStyle(mockLog, raw);
        const result = render({ style: validatedStyle }, baseV2Content, mockLog);
        expect(result).toMatch(/class="main[^"]*grayscale[^"]*"/);
        expect(result).not.toContain('greyscale');
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

    test('maps validated v5 text style options to root data attributes', () => {
        const options = {
            style: {
                layout: 'text',
                logo: { type: 'primary', position: 'top' },
                text: { align: 'center', color: 'white', size: 16 }
            }
        };
        const result = render(options, baseV2Content, mockLog);
        expect(result).toContain('data-pp-style-layout="text"');
        expect(result).toContain('data-pp-style-logo-position="top"');
        expect(result).toContain('data-pp-style-logo-type="primary"');
        expect(result).toContain('data-pp-style-text-align="center"');
        expect(result).toContain('data-pp-style-text-color="white"');
        expect(result).toContain('data-pp-style-text-size="16"');
    });
});

describe('v2 render fontSource', () => {
    test('generates @font-face rule for a single fontSource URL', () => {
        const options = {
            style: {
                ...baseOptions.style,
                text: { color: 'black', size: 12, fontSource: ['https://example.com/font.woff2'] }
            }
        };
        const result = render(options, baseV2Content, mockLog);
        expect(result).toContain('@font-face');
        expect(result).toContain("url('https://example.com/font.woff2')");
        expect(result).toContain("font-family: 'PP Merchant Font 1'");
    });

    test('prepends custom font name to font-family stack', () => {
        const options = {
            style: {
                ...baseOptions.style,
                text: { color: 'black', size: 12, fontSource: ['https://example.com/font.woff2'] }
            }
        };
        const result = render(options, baseV2Content, mockLog);
        expect(result).toMatch(/font-family:\s*'PP Merchant Font 1',/);
        expect(result).not.toContain('"PayPal Pro"');
    });

    test('generates one @font-face rule per fontSource URL', () => {
        const options = {
            style: {
                ...baseOptions.style,
                text: {
                    color: 'black',
                    size: 12,
                    fontSource: ['https://example.com/font1.woff2', 'https://example.com/font2.woff2']
                }
            }
        };
        const result = render(options, baseV2Content, mockLog);
        expect(result).toContain("url('https://example.com/font1.woff2')");
        expect(result).toContain("url('https://example.com/font2.woff2')");
        expect(result).toContain("'PP Merchant Font 1'");
        expect(result).toContain("'PP Merchant Font 2'");
    });

    test('includes explicit fontFamily after fontSource names in font-family stack', () => {
        const options = {
            style: {
                ...baseOptions.style,
                text: {
                    color: 'black',
                    size: 12,
                    fontSource: ['https://example.com/font.woff2'],
                    fontFamily: ['MyFont']
                }
            }
        };
        const result = render(options, baseV2Content, mockLog);
        expect(result).toMatch(/'PP Merchant Font 1',\s*'MyFont',/);
    });

    test('includes explicit fontFamily without fontSource', () => {
        const options = {
            style: {
                ...baseOptions.style,
                text: { color: 'black', size: 12, fontFamily: ['Impact', 'sans-serif'] }
            }
        };
        const result = render(options, baseV2Content, mockLog);
        expect(result).toContain("font-family: 'Impact', sans-serif, Helvetica");
    });

    test('uses PayPal Pro default font-family when fontSource is not provided', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(result).not.toContain('@font-face');
        expect(result).toContain('"PayPal Pro"');
    });

    test('uses PayPal Pro default font-family when fontSource is empty array', () => {
        const options = {
            style: { ...baseOptions.style, text: { color: 'black', size: 12, fontSource: [] } }
        };
        const result = render(options, baseV2Content, mockLog);
        expect(result).not.toContain('@font-face');
        expect(result).toContain('"PayPal Pro"');
    });

    test('ignores unsafe fontSource URLs', () => {
        const options = {
            style: {
                ...baseOptions.style,
                text: { color: 'black', size: 12, fontSource: ['./font.woff2'] }
            }
        };
        const result = render(options, baseV2Content, mockLog);
        expect(result).not.toContain('@font-face');
        expect(result).not.toContain('./font.woff2');
    });

    test('ignores unsafe fontFamily values', () => {
        const options = {
            style: {
                ...baseOptions.style,
                text: { color: 'black', size: 12, fontFamily: ["</style><script>alert('x')</script>"] }
            }
        };
        const result = render(options, baseV2Content, mockLog);
        expect(result).not.toContain('<script>');
        expect(result).toContain('"PayPal Pro"');
    });
});

describe('v2 render snapshots', () => {
    const contentWithLogo = {
        main_items: [
            {
                type: 'IMAGE',
                source_url: 'https://example.com/logo.svg',
                alternative_text: 'PayPal',
                name: 'paypal_logo'
            },
            { type: 'TEXT', text: 'Pay Later.' }
        ],
        action_items: [{ type: 'LINK', text: 'Learn more', click_url: 'https://example.com/lander', embeddable: true }],
        disclaimer_items: [{ type: 'TEXT', text: 'Subject to approval.' }]
    };

    const baseStyleOptions = {
        style: {
            layout: 'text',
            logo: { type: 'primary', position: 'left' },
            text: { color: 'black', size: 12, align: 'left' }
        }
    };

    test('full render snapshot for representative case', () => {
        expect(render(baseStyleOptions, contentWithLogo)).toMatchSnapshot();
    });

    test('renders the v2 stylesheet once', () => {
        const result = render(baseStyleOptions, contentWithLogo);
        expect(result.match(/<style>[\s\S]*?<\/style>/)[0]).toMatchSnapshot();
    });

    test.each([['primary'], ['alternative'], ['inline'], ['none']])('maps logo type: %s', logoType => {
        const options = {
            style: {
                layout: 'text',
                logo: { type: logoType, position: 'left' },
                text: { color: 'black', size: 12, align: 'left' }
            }
        };
        const result = render(options, contentWithLogo);
        expect(result).toContain(`data-pp-style-logo-type="${logoType}"`);
    });

    test.each([['left'], ['right'], ['top']])('maps logo position: %s', position => {
        const options = {
            style: {
                layout: 'text',
                logo: { type: 'primary', position },
                text: { color: 'black', size: 12, align: 'left' }
            }
        };
        const result = render(options, contentWithLogo);
        expect(result).toContain(`data-pp-style-logo-position="${position}"`);
    });

    test.each([['black'], ['white'], ['monochrome'], ['grayscale']])('maps text color: %s', color => {
        const options = {
            style: {
                layout: 'text',
                logo: { type: 'primary', position: 'left' },
                text: { color, size: 12, align: 'left' }
            }
        };
        const result = render(options, baseV2Content);
        expect(result).toContain(`data-pp-style-text-color="${color}"`);
    });

    test.each([[10], [11], [12], [13], [14], [15], [16]])('maps text size: %spx', size => {
        const options = {
            style: {
                layout: 'text',
                logo: { type: 'primary', position: 'left' },
                text: { color: 'black', size, align: 'left' }
            }
        };
        const result = render(options, baseV2Content);
        expect(result).toContain(`data-pp-style-text-size="${size}"`);
    });

    test.each([['left'], ['center'], ['right']])('maps text align: %s', align => {
        const options = {
            style: {
                layout: 'text',
                logo: { type: 'primary', position: 'left' },
                text: { color: 'black', size: 12, align }
            }
        };
        const result = render(options, baseV2Content);
        expect(result).toContain(`data-pp-style-text-align="${align}"`);
    });
});

describe('v2 render stylesheet isolation', () => {
    test('stylesheet is embedded inline — no external CSS dependency', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        expect(result).toMatch(/<style>[\s\S]*?<\/style>/);
        expect(result).not.toContain('<link');
    });

    test('all stylesheet selectors are scoped to .pp-message or body reset', () => {
        const result = render(baseOptions, baseV2Content, mockLog);
        const css = result.match(/<style>([\s\S]*?)<\/style>/)[1];
        const selectorLines = css
            .split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 0 && !l.startsWith('@') && !l.startsWith('}') && l.includes('{'));
        expect(selectorLines.every(l => l.startsWith('.pp-message') || l.startsWith('body'))).toBe(true);
    });
});
