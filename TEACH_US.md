# Teach Us: Accessibility Is Not Extra Work — It's Correct Work

## The idea

Most developers treat accessibility as a polish layer — something you add at the end if there's time. That's backwards. **Accessibility is just correctly structured HTML.** If you start with semantics, you get SEO, clarity, and a11y for free.

## What most codebases look like

```html
<div class="card" onclick="handleClick()">
  <div class="title">Submit Feedback</div>
  <div class="desc">Rate your experience</div>
</div>
```

This "works" visually. But a screen reader hears nothing useful, keyboard navigation is broken, search engines see flat text with no hierarchy, and your JavaScript bundle is doing work the browser could do natively.

## What it should look like

```html
<article class="card">
  <h2>Submit Feedback</h2>
  <p>Rate your experience</p>
  <a href="/feedback">Open form</a>
</article>
```

No ARIA attributes needed. No `tabindex` gymnastics. The browser gives you focus management, screen reader announcements, keyboard interaction, and SEO relevance — all because you used the right element.

## Three rules that cover 90% of cases

### 1. Use `<button>` for actions, `<a>` for navigation

A `<div onClick>` is not keyboard-accessible. A `<button>` or `<a>` is — natively. You get Enter/Space handling, focus ring, and screen reader announcements. No extra code.

### 2. Use heading tags (`<h1>`–`<h6>`) for document structure

Don't style a `<div>` to look like a heading. Use `<h2>`. Screen reader users navigate by headings. Search engines use them for content relevance. You get both with one tag.

### 3. Every `<input>` needs a `<label>`

```html
<label for="email">Email</label>
<input id="email" type="email" required />
```

Clicking the label focuses the input. Screen readers announce the label when the input receives focus. No ARIA needed. This is just correct HTML.

## Why this makes Acowale better

- **SEO improvements are automatic** — Semantic HTML is what search engines understand best. You don't need separate SEO work.
- **Testing shrinks** — Native elements have built-in behaviour you don't need to test. A `<button>` already handles click, keyboard, and focus.
- **Users are diverse** — 15% of the global population has some disability. Keyboard-only users, screen reader users, low-vision users, and users with temporary impairments (broken arm, bright sunlight) all benefit from accessible code.
- **Legal risk drops** — Accessibility lawsuits are rising. Building it in from day one is cheaper than retrofitting.

## The concrete test

Close your eyes and try to use your product with only a keyboard (Tab, Enter, Space, arrow keys). If you can complete every flow, you're 80% of the way there. If you can't, you've found bugs that affect real users — and real revenue.

Accessibility isn't a feature. It's engineering correctness.
