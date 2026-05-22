# Sprint 0.5｜UI / UX Spec Freeze

## Goal

Freeze TravelMemory visual and UX rules before Sprint 1 UI implementation.

This sprint is documentation-only.

Create:

```txt
docs/ui-ux.md
docs/sprints/sprint-0.5-ui-ux.md
```

Do not create React components.
Do not modify app pages.
Do not install UI libraries.
Do not import `animal-island-ui`.

## Scope

Define only:

- Visual direction.
- Five MVP pages.
- First-batch components.
- `tm-*` theme tokens.
- CSS variable contract.
- Typography contract.
- Mobile-first layout.
- PosterPreview ratio rule.
- Button and Card rules.
- Upload UX copy.
- Generating UX copy.
- Result UX order.
- Share Landing UX order.
- Non-infringement boundary.
- Codex / Cursor generation rules.
- Sprint 0.5 acceptance checklist.
- Sprint 1 UI implementation gate.

## Visual Direction

TravelMemory UI must use a **cozy island travel postcard style** and a **soft island atmosphere**.

Allowed inspiration:

- Warm rounded UI.
- Travel postcard feeling.
- Soft island atmosphere.
- Scrapbook feeling.
- Gentle paper texture.
- Original cute graphics.
- Original icons.
- Original illustrations.

Forbidden references:

- `animal-island-ui` runtime.
- `animal-island-ui` styles.
- `animal-island-ui` components.
- `animal-island-ui` icons.
- `animal-island-ui` fonts.
- `animal-island-ui` animations.
- Nintendo references.
- Animal Crossing references.
- 动森 references.
- 狸克 references.
- Nook references.
- Game cursor.
- Leaf bell.

## MVP Pages

Only define these five MVP pages:

- **Home:** Explain value and drive upload.
- **Upload:** Collect photo, city, date, and mood.
- **Generating:** Reduce waiting anxiety.
- **Result:** Drive poster download and caption copy.
- **Share Landing:** Convert new visitor to uploader.

Do not define:

- Dashboard.
- Account center.
- Settings.
- Template marketplace.
- Admin.
- Analytics.

## Component List

Allowed first-batch components:

- Button.
- Card.
- PhotoUploader.
- MemoryPreviewCard.
- LoadingStep.
- PosterPreview.
- CaptionBlock.
- ShareCTA.
- SoftBadge.

No other components unless required by a later sprint.

## Required Theme Contract

Sprint 1 must implement this contract before building pages:

- `tailwind.config.js` or `tailwind.config.ts` defines `tm-*` colors, radii, shadows, and `maxWidth`.
- Global CSS defines `--color-*` variables.
- All UI code uses `tm-*` classes.
- No brand hex colors in components.

Required theme tokens:

- `bg-tm-bg`
- `bg-tm-surface`
- `bg-tm-surfaceSoft`
- `bg-tm-primary`
- `bg-tm-primarySoft`
- `bg-tm-accent`
- `text-tm-text`
- `text-tm-muted`
- `border-tm-border`
- `rounded-tm-card`
- `rounded-tm-btn`
- `rounded-tm-pill`
- `shadow-tm-card`
- `shadow-tm-soft`
- `max-w-tm-page`
- `max-w-tm-poster`

## Required CSS Variable Contract

Global CSS must define:

```css
:root {
  --color-bg: #FDFBF7;
  --color-surface: #FFFFFF;
  --color-surface-soft: #FFF8EE;
  --color-primary: #4B7A6C;
  --color-primary-soft: #E6F0EC;
  --color-accent: #E68A5C;
  --color-text: #3A3530;
  --color-text-muted: #7B7168;
  --color-border: #EDE9E2;
  --color-danger: #A85C4A;
}
```

Components and pages must use Tailwind `tm-*` tokens instead of hardcoded brand colors.

## Required Typography Contract

Global font stack:

```css
font-family:
  "PingFang SC",
  "Helvetica Neue",
  Arial,
  -apple-system,
  sans-serif;
```

Rules:

- No external web font.
- No decorative font.
- No Nintendo-like font.
- No Animal Crossing-like font.
- No page-level `font-family` override.
- Title uses `font-semibold` or `font-bold`.
- Body uses `font-normal`.
- Button uses `font-semibold`.
- Badge uses `font-medium`.

## Required Mobile-First Layout

Future UI implementation must:

- Keep pages mobile-first.
- Keep page max width at `480px`.
- Use `max-w-tm-page`.
- Center the mobile-width page container on desktop.
- Use horizontal padding from `16px` to `24px`.
- Keep buttons at least `44px` high.
- Keep primary CTA visible.
- Avoid separate desktop-first layouts.

## Required PosterPreview Contract

PosterPreview must use:

- `aspect-[9/16]`
- `w-full`
- `max-w-tm-poster`
- `mx-auto`
- `rounded-tm-card`
- `shadow-tm-card`
- `object-cover`

It must not use:

- `object-fill`
- Fixed `1080px` width.
- Fixed `1920px` height.
- Missing aspect-ratio wrapper.
- Dark heavy shadow.
- Game-like border.

Acceptance:

- Poster does not distort.
- Result page keeps download CTA near poster.
- Share landing keeps "Generate mine" CTA visible.

## Required Button And Card Rules

Button rules:

- Minimum height: `44px`.
- Use `rounded-tm-btn` or `rounded-tm-pill`.
- Use `tm` colors only.
- One primary CTA per screen.
- Do not create page-specific button styles.

Button variants to support later:

- `primary`
- `secondary`
- `ghost`
- `danger`

Card rules:

- Use `rounded-tm-card`.
- Use `shadow-tm-card` or `shadow-tm-soft`.
- Use `bg-tm-surface` or `bg-tm-surfaceSoft`.
- Use `border-tm-border` when border is needed.
- Do not use hard black shadows.
- Do not use game-style thick outlines.

## Required Upload UX Copy

Upload page must make users feel safe.

Required content:

- PhotoUploader.
- Photo preview.
- City input.
- Travel date input.
- Mood selection.
- Generate CTA.

Copy examples:

- 上传一张你喜欢的旅行照片
- 默认使用第一张照片作为主图
- 你的照片只用于生成本次旅行记忆

## Required Generating UX Copy

Use friendly step copy:

- AI 正在读你的旅行情绪…
- 旅行策展人正在写明信片…
- 正在生成可分享海报…
- 快好了，正在整理你的旅行记忆…

Do not show:

- Loading...
- Processing...
- Server busy.
- Model inference running.
- Technical logs.

## Required Result UX Order

Priority:

1. Poster preview.
2. Download poster.
3. Copy caption.
4. Share.
5. Regenerate.

First screen should show:

- Title.
- PosterPreview.
- Main CTA.

## Required Share Landing UX Order

Goal:

Convert new visitors.

Required order:

1. Show shared memory.
2. Show poster preview.
3. CTA: 我也生成一张
4. Secondary CTA: 复制同款情绪

Future compatible with Dummy Mode.

## Legal / Originality Contract

Allowed:

- Warm rounded UI.
- Travel postcard feeling.
- Soft island atmosphere.
- Cozy island travel postcard style.
- Scrapbook feeling.
- Gentle paper texture.
- Original icons.
- Original illustrations.

Forbidden:

- `animal-island-ui` runtime.
- `animal-island-ui` styles.
- `animal-island-ui` components.
- `animal-island-ui` icons.
- `animal-island-ui` fonts.
- `animal-island-ui` animations.
- Nintendo references.
- Animal Crossing references.
- 动森 references.
- 狸克 references.
- Nook references.
- NookPhone references.
- Game cursor.
- Leaf bell.

## Codex / Cursor Output Rules

For future UI implementation, generated code must:

- Use TailwindCSS.
- Use `tm-*` tokens.
- Use shared UI components.
- Keep files small and focused.
- Keep pages mobile-first.
- Keep page max width `480px`.
- Keep buttons at least `44px` high.
- Keep PosterPreview 9:16.
- Keep primary CTA visible.
- Avoid external UI libraries.
- Avoid hardcoded brand hex colors.
- Avoid copied external component APIs.

Generated code must not contain:

- `animal-island-ui`
- `import 'animal-island-ui/style'`
- `from 'animal-island-ui'`
- `Nintendo`
- `Animal Crossing`
- `动森`
- `狸克`
- `Nook`
- `NookPhone`
- `bg-[#FDFBF7]`
- `text-[#3A3530]`
- `border-[#EDE9E2]`
- `object-fill`
- `style={{ fontFamily:`

## Sprint 0.5 Acceptance Checklist

Documentation:

- [ ] `docs/ui-ux.md` exists.
- [ ] `docs/sprints/sprint-0.5-ui-ux.md` exists.
- [ ] Visual direction is defined.
- [ ] Allowed inspiration is defined.
- [ ] Forbidden references are defined.
- [ ] Five MVP pages are defined.
- [ ] Component list is defined.
- [ ] `tm-*` Tailwind token contract is defined.
- [ ] CSS variable contract is defined.
- [ ] PosterPreview 9:16 contract is defined.
- [ ] Mobile-first layout rule is defined.
- [ ] Cross-platform font stack is defined.
- [ ] Legal / originality boundary is defined.
- [ ] Upload UX copy is defined.
- [ ] Generating UX copy is defined.
- [ ] Result UX order is defined.
- [ ] Share Landing UX order is defined.
- [ ] Codex / Cursor hard rules are defined.
- [ ] Sprint 1 UI implementation gate is defined.

Non-goals:

- [ ] No React components added.
- [ ] No app pages modified.
- [ ] No UI package installed.
- [ ] No `animal-island-ui` import.

## Sprint 1 UI Implementation Gate

Future Sprint 1 gate:

- [ ] `tailwind.config.js` or `tailwind.config.ts` implements `tm-*` tokens before UI pages.
- [ ] `globals.css` implements `--color-*` variables.
- [ ] Button/Card/PosterPreview use `tm-*` classes only.
- [ ] No hardcoded brand hex colors in components.
- [ ] Result page PosterPreview is 9:16.
- [ ] Primary CTA is visible on mobile.
