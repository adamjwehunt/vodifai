export function findFocusableElements(rootElement: HTMLElement) {
	return rootElement.querySelectorAll<HTMLElement>(
		'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]):not(svg)'
	);
}

export function applyAriaHidden(
	elements: NodeListOf<HTMLElement>,
	value: string
) {
	elements.forEach((el) => {
		if (
			el.tagName.toLowerCase() !== 'svg' &&
			!el.id.includes('watch-modal-close-button')
		) {
			el.setAttribute('aria-hidden', value);
			el.setAttribute('tabindex', '-1');
			el.setAttribute('data-previously-hidden', 'true');
		}
	});
}

export function applyTabindex(
	elements: NodeListOf<HTMLElement>,
	value: string
) {
	elements.forEach((el) => {
		if (
			el.tagName !== 'SVG' &&
			((el.hasAttribute('tabindex') && el.getAttribute('tabindex') !== '-1') ||
				el.getAttribute('data-previously-hidden') === 'true')
		) {
			el.setAttribute('tabindex', value);
		}
	});
}
