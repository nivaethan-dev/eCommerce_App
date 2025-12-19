# Color Guide - Silver-Blue Theme

## Primary Colors
```css
--primary-blue: #4facfe;
--light-silver: #c9d6ff;
--hover-blue: #3d9ae8;
--text-dark: #213547;
--border-light: #e2e8f0;
--bg-light: #f8fafc;
```

## Global Design
- **No dark mode** - looks the same in all browsers
- **Consistent theme** across all pages

---

## Home Page

### Hero Section
- Background: `linear-gradient(135deg, #c9d6ff 0%, #4facfe 100%)`
- Text: `white`
- Button: White bg, `#4facfe` text/border → Hover: `#4facfe` bg, white text

### Categories Section
- Background: `linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)`
- Title: `#4facfe`
- Card text: `#213547`
- Button: `#4facfe` bg → Hover: `#3d9ae8`

---

## Header (Light Always)
- Background: `white`
- Border: `#e0e0e0`
- Text: `#213547`
- Logo: `#4facfe`
- Search: `#f5f5f5` bg
- Buttons: `#4facfe`
- Hovers: `#4facfe` with `#f5f5f5` bg

---

## Footer (Light Always)
- Background: `#f5f5f5`
- Bottom: `#eeeeee`
- Text: `#213547`
- Links: Hover to `#4facfe`

---

## Login/Signup Forms

### Background
```css
background: 
  linear-gradient(135deg, rgba(201, 214, 255, 0.3), rgba(79, 172, 254, 0.3)),
  radial-gradient(circle at 20% 50%, rgba(79, 172, 254, 0.1) 0%, transparent 50%),
  radial-gradient(circle at 80% 80%, rgba(201, 214, 255, 0.15) 0%, transparent 50%),
  #f8fafc;
```

### Input Fields
- Default: `#f8fafc` bg, `#e2e8f0` border
- Focus: `white` bg, `#4facfe` border, blue glow
- Filled: `white` bg, `#cbd5e1` border
- Autofill: `#f0f7ff` bg (light blue, not yellow!)

### Buttons
- Primary: `#4facfe` bg → Hover: `#3d9ae8`
- Font weight: `700` (bold)
- Links: `#4facfe` color

---

## Key Principles
1. **Silver-blue everywhere** (`#4facfe`)
2. **Light theme only** - no dark mode switching
3. **Visual feedback** - inputs change when active
4. **Clean shadows** - no blur
5. **Solid colors** - crisp rendering

