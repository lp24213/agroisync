# Accessibility (A11y) Guidelines

This directory contains accessibility-related configurations, tests, and guidelines for the AGROTM Solana project.

## Overview

We are committed to making AGROTM Solana accessible to all users, including those with disabilities. This includes compliance with WCAG 2.1 AA standards and following best practices for web accessibility.

## Directory Structure

```
a11y/
├── README.md              # This file
├── tests/                 # Accessibility tests
├── guidelines/            # Accessibility guidelines
├── components/            # Accessible component examples
└── tools/                 # Accessibility testing tools
```

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Perceivable**: Information and user interface components must be presentable to users in ways they can perceive
- **Operable**: User interface components and navigation must be operable
- **Understandable**: Information and the operation of user interface must be understandable
- **Robust**: Content must be robust enough that it can be interpreted by a wide variety of user agents, including assistive technologies

### Key Requirements
- **Keyboard Navigation**: All functionality must be accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 contrast ratio for normal text
- **Focus Management**: Visible focus indicators and logical tab order
- **Alternative Text**: Descriptive alt text for images
- **Form Labels**: Proper labeling of form controls

## Testing

### Automated Testing
```bash
# Run accessibility tests
npm run test:a11y

# Run axe-core tests
npm run test:axe

# Run Lighthouse accessibility audit
npm run test:lighthouse
```

### Manual Testing
1. **Keyboard Navigation**: Test all functionality with keyboard only
2. **Screen Reader Testing**: Test with NVDA, JAWS, or VoiceOver
3. **Color Contrast**: Use tools like WebAIM Contrast Checker
4. **Focus Management**: Verify logical tab order and visible focus

## Tools and Resources

### Testing Tools
- **axe-core**: Automated accessibility testing
- **Lighthouse**: Google's accessibility audit tool
- **WAVE**: Web Accessibility Evaluation Tool
- **Color Contrast Analyzer**: Check color contrast ratios

### Screen Readers
- **NVDA** (Windows): Free screen reader
- **JAWS** (Windows): Commercial screen reader
- **VoiceOver** (macOS): Built-in screen reader
- **TalkBack** (Android): Built-in screen reader

### Browser Extensions
- **axe DevTools**: Chrome/Firefox extension
- **WAVE**: Chrome/Firefox extension
- **Color Contrast Analyzer**: Chrome extension

## Component Guidelines

### Semantic HTML
```html
<!-- Good -->
<button aria-label="Close modal">×</button>
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<!-- Bad -->
<div onclick="closeModal()">×</div>
<div>
  <div><a href="/">Home</a></div>
</div>
```

### ARIA Labels
```html
<!-- Good -->
<input type="text" aria-label="Search for products" />
<button aria-expanded="false" aria-controls="menu">Menu</button>

<!-- Bad -->
<input type="text" />
<button>Menu</button>
```

### Focus Management
```javascript
// Good - Manage focus properly
const modal = document.getElementById('modal');
const closeButton = document.getElementById('close-button');

modal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeButton.focus(); // Return focus to trigger
  }
});
```

## Common Issues and Solutions

### 1. Missing Alt Text
**Issue**: Images without alt text
**Solution**: Add descriptive alt text or aria-label

### 2. Poor Color Contrast
**Issue**: Text not readable due to low contrast
**Solution**: Use color contrast checker and adjust colors

### 3. Missing Focus Indicators
**Issue**: No visible focus on interactive elements
**Solution**: Add CSS focus styles

### 4. Non-semantic HTML
**Issue**: Using divs instead of semantic elements
**Solution**: Use proper HTML5 semantic elements

### 5. Missing ARIA Labels
**Issue**: Form controls without labels
**Solution**: Add proper labels or aria-label attributes

## Accessibility Checklist

### Content
- [ ] All images have alt text
- [ ] Videos have captions and transcripts
- [ ] Color is not the only way to convey information
- [ ] Text has sufficient color contrast

### Navigation
- [ ] All functionality is keyboard accessible
- [ ] Focus order is logical
- [ ] Focus indicators are visible
- [ ] Skip links are available

### Forms
- [ ] All form controls have labels
- [ ] Error messages are clear and accessible
- [ ] Required fields are marked
- [ ] Form validation is announced

### Interactive Elements
- [ ] Buttons have descriptive text
- [ ] Links have meaningful text
- [ ] Custom controls have ARIA attributes
- [ ] Dynamic content updates are announced

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)

## Reporting Issues

If you find accessibility issues, please:

1. Create an issue with the `accessibility` label
2. Describe the issue clearly
3. Include steps to reproduce
4. Mention the assistive technology used (if applicable)
5. Provide screenshots or screen recordings if helpful

## Training

- Complete accessibility training modules
- Attend accessibility workshops
- Review accessibility guidelines regularly
- Test with assistive technologies

## Compliance

This project aims to meet:
- WCAG 2.1 AA standards
- Section 508 compliance
- ADA Title III requirements
- Local accessibility laws and regulations 