# TravelMemory UI / UX Spec v0.1

## 1. Visual Direction

TravelMemory is a warm, healing, travel-postcard-like AI memory tool with a **cozy island travel postcard style** and a **soft island atmosphere**.

Visual keywords:

```txt
cozy travel postcard
cozy island travel postcard style
soft island feeling
soft island atmosphere
warm memory
rounded cards
gentle shadows
playful but not childish
mobile-first
scrapbook feeling
```

## 2. Allowed Inspiration

Allowed inspiration:

- Warm rounded UI.
- Travel postcard feeling.
- Soft island atmosphere.
- Scrapbook feeling.
- Gentle paper texture.
- Original cute graphics.
- Original icons.
- Original illustrations.

## 3. Forbidden References

Forbidden references:

- Animal Crossing style.
- Nintendo-like.
- Copy animal-island-ui.
- Same icons.
- Same layout.
- Same typography.
- Game UI clone.

Never use:

- Nintendo.
- Animal Crossing.
- 动森.
- 狸克.
- 叶子铃铛.
- Nook.
- NookPhone.
- Game cursor.
- Leaf bell.

## 4. Product Pages

Only define these five MVP pages:

- **Home:** Explain "upload travel photo -> generate travel memory poster".
- **Upload:** Make users comfortable uploading photos.
- **Generating:** Reduce waiting anxiety.
- **Result:** Drive copy caption, download poster, and share.
- **Share Landing:** Make new users upload their own photos.

Do not define:

- Admin dashboard.
- Account center.
- Settings page.
- Template marketplace.
- Growth analytics page.

## 5. Reusable Component List

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

Rules:

- Use shared components.
- Do not restyle per page.
- All colors must use `tm-*` theme tokens.
- All cards use shared radius and shadow.
- All pages use mobile-first max width.
- No other components unless required by a later sprint.

## 6. Tailwind Theme Token Contract

All TravelMemory UI code must use `tm-*` tokens.

Forbidden in page/component code:

- `bg-[#FDFBF7]`
- `text-[#3A3530]`
- `border-[#EDE9E2]`
- `shadow-[...]`
- Inline brand hex colors.
- Copied external color palette.

Required Tailwind mapping:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        tm: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          surfaceSoft: 'var(--color-surface-soft)',
          primary: 'var(--color-primary)',
          primarySoft: 'var(--color-primary-soft)',
          accent: 'var(--color-accent)',
          text: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          border: 'var(--color-border)',
          danger: 'var(--color-danger)'
        }
      },
      borderRadius: {
        'tm-card': '24px',
        'tm-btn': '16px',
        'tm-pill': '999px'
      },
      boxShadow: {
        'tm-card': '0 12px 30px rgba(58, 53, 48, 0.08)',
        'tm-soft': '0 8px 20px rgba(58, 53, 48, 0.06)',
        'tm-floating': '0 16px 40px rgba(58, 53, 48, 0.10)'
      },
      maxWidth: {
        'tm-page': '480px',
        'tm-poster': '340px'
      }
    }
  }
}
```

Allowed utility examples:

- `bg-tm-bg`
- `bg-tm-surface`
- `bg-tm-surfaceSoft`
- `bg-tm-primary`
- `bg-tm-primary/90`
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

Do not invent new theme colors without updating this document first.

## 7. CSS Variable Contract

Required global CSS variables:

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

The CSS variables are the only place where these brand colors should be declared. Components and pages must consume them through `tm-*` Tailwind classes.

## 8. Typography Contract

Use this global font stack:

```css
font-family:
  "PingFang SC",
  "Helvetica Neue",
  Arial,
  -apple-system,
  sans-serif;
```

Rules:

- Mobile-first.
- WeChat WebView-friendly.
- Future mini-program-friendly.
- No Nintendo-like fonts.
- No Animal Crossing-like fonts.
- No decorative web fonts.
- No external font dependency.
- No page-level `font-family` override.

Font weights:

- Title: `font-semibold` or `font-bold`.
- Body: `font-normal`.
- Button: `font-semibold`.
- Badge: `font-medium`.

## 9. Mobile-First Layout Rules

Mobile-first rules:

- Main page max-width: `480px`.
- Use `max-w-tm-page`.
- Center page container.
- Horizontal padding: `16px` to `24px`.
- Button height: at least `44px`.
- Primary CTA must be obvious.
- Result page first screen should show title, poster preview, and main action.

Desktop rule:

- Do not design a separate desktop layout.
- Use centered mobile-width container on desktop.

## 10. PosterPreview 9:16 Implementation Contract

Purpose:

Display the Cloudinary-generated 9:16 poster on Result and Share Landing pages.

Required implementation shape:

```tsx
<div className="mx-auto w-full max-w-tm-poster">
  <div className="aspect-[9/16] w-full overflow-hidden rounded-tm-card shadow-tm-card">
    <img
      src={posterUrl}
      alt="Travel memory poster"
      className="h-full w-full object-cover"
    />
  </div>
</div>
```

Must use:

- `aspect-[9/16]`
- `w-full`
- `max-w-tm-poster`
- `mx-auto`
- `rounded-tm-card`
- `shadow-tm-card`
- `object-cover`

Forbidden:

- `object-fill`
- Fixed `1080px` width.
- Fixed `1920px` height.
- Missing aspect-ratio wrapper.
- Stretched image.
- Dark heavy shadow.
- Game-like thick border.

Result page order:

1. PosterPreview.
2. Download poster CTA.
3. Copy caption CTA.
4. Share CTA.

Share landing page order:

1. PosterPreview.
2. "Generate mine" CTA.
3. "Copy same mood" CTA.

## 11. Button And Card Rules

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

## 12. Upload UX Copy

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

## 13. Generating UX Copy

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

## 14. Result UX Order

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

## 15. Share Landing UX Order

Goal:

Convert new visitors.

Required:

1. Show shared memory.
2. Show poster preview.
3. CTA: 我也生成一张
4. Secondary CTA: 复制同款情绪

Future compatible with Dummy Mode.

## 16. Runtime / Legal Boundary

Do not install or import:

- `animal-island-ui`
- `animal-island-ui/style`

Do not copy:

- `animal-island-ui` source code.
- `animal-island-ui` CSS / Less.
- `animal-island-ui` icons.
- `animal-island-ui` fonts.
- `animal-island-ui` animations.
- `animal-island-ui` component API.
- `animal-island-ui` layout.

Forbidden code patterns:

```ts
import 'animal-island-ui/style'
import { Button } from 'animal-island-ui'
import { Card } from 'animal-island-ui'
import { Cursor } from 'animal-island-ui'
```

Reason:

TravelMemory must be an original, commercial-ready product. It can use warm rounded travel-postcard aesthetics, cozy island travel postcard style, and soft island atmosphere, but must not create brand confusion or runtime dependency on a game-inspired UI kit.

## 17. Codex / Cursor Hard Rules

When generating UI code later:

- Use TailwindCSS.
- Use `tm-*` tokens only.
- Use shared components.
- Do not hardcode brand hex colors.
- Do not import external UI kits.
- Do not use `animal-island-ui`.
- Do not use Nintendo / Animal Crossing wording.
- Do not create desktop-first layouts.
- Do not stretch poster images.
- Do not hide primary CTA below unnecessary content.

A generated UI change fails if it contains:

- `animal-island-ui`
- `Nintendo`
- `Animal Crossing`
- `动森`
- `狸克`
- `Nook`
- `bg-[#...`
- `text-[#...`
- `object-fill`
- `style={{ fontFamily:`

## 18. Sprint 0.5 Acceptance Checklist

Documentation:

- [ ] `docs/ui-ux.md` exists.
- [ ] `docs/sprints/sprint-0.5-ui-ux.md` exists.
- [ ] Visual direction is defined.
- [ ] Allowed inspiration is defined.
- [ ] Forbidden references are defined.
- [ ] Five MVP pages are defined.
- [ ] Reusable component list is defined.
- [ ] `tm-*` Tailwind theme token contract is defined.
- [ ] CSS variable contract is defined.
- [ ] Typography contract is defined.
- [ ] Mobile-first layout rule is defined.
- [ ] PosterPreview 9:16 contract is defined.
- [ ] Button and Card rules are defined.
- [ ] Upload UX copy is defined.
- [ ] Generating UX copy is defined.
- [ ] Result UX order is defined.
- [ ] Share Landing UX order is defined.
- [ ] Runtime / legal boundary is defined.
- [ ] Codex / Cursor hard rules are defined.

Non-goals:

- [ ] No React components added.
- [ ] No app pages modified.
- [ ] No UI package installed.
- [ ] No `animal-island-ui` import.

## 19. Sprint 1 UI Implementation Gate

Sprint 1 must not build UI pages until:

- [ ] `tailwind.config.js` or `tailwind.config.ts` implements `tm-*` tokens.
- [ ] `globals.css` implements `--color-*` variables.
- [ ] Button/Card/PosterPreview use `tm-*` classes only.
- [ ] No hardcoded brand hex colors appear in components.
- [ ] Result page PosterPreview is 9:16.
- [ ] Primary CTA is visible on mobile.
