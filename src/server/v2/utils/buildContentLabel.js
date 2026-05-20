export function buildContentLabel(items) {
    return items
        .map(item => (item.alt || item.content)?.trim())
        .filter(Boolean)
        .join(' ');
}
