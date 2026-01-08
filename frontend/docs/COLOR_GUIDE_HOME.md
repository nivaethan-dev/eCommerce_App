# Homepage Color Guide

## Primary Color Palette

### Silver-Blue Theme
- **Primary Blue**: `#4facfe` - Main brand color
- **Light Silver**: `#c9d6ff` - Soft accent color
- **Darker Blue**: `#3d9ae8` - Hover states

---

## Color Application

### Hero Section
**Background**: `linear-gradient(135deg, #c9d6ff 0%, #4facfe 100%)`
- Silver to blue gradient (135° diagonal)
- Creates modern, professional look

**Text**: `white`
- High contrast on gradient background
- Text shadows for depth

**CTA Button**:
- Default: `white` background, `#4facfe` text, `#4facfe` border
- Hover: `#4facfe` background, `white` text

---

### Categories Section
**Background**: `linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)`
- Light blue tint fading to white
- Smooth transition from hero

**Section Title**: `#4facfe`

**Category Cards**:
- Background: `white`
- Text: `#213547` (dark gray)
- Hover shadow: `rgba(79, 172, 254, 0.2)` (blue tint)

**Category Buttons**:
- Default: `#4facfe` background, `white` text
- Hover: `#3d9ae8` background (darker blue)

---

## Quick Reference

```css
/* Primary Colors */
--primary-blue: #4facfe;
--light-silver: #c9d6ff;
--hover-blue: #3d9ae8;

/* Backgrounds */
--hero-gradient: linear-gradient(135deg, #c9d6ff 0%, #4facfe 100%);
--section-gradient: linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%);

/* Text */
--heading-color: #4facfe;
--body-text: #213547;
--white-text: white;
```

---

## Design Principles
1. **Consistency**: All interactive elements use `#4facfe`
2. **Contrast**: White text on blue, blue text on white
3. **Clarity**: Solid colors for buttons (no blur)
4. **Depth**: Blue-tinted shadows for cohesion

