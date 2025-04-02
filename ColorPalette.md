# StyleSense AI Color Palette

## Brand Identity

StyleSense AI emphasizes simplicity, accessibility, and reliability. The color palette focuses on clean, modern colors that create a streamlined experience while maintaining a professional aesthetic that builds trust in the app's recommendations.

## Primary Colors

### Deep Indigo `#2D3047`
- **Usage**: Primary brand color, headers, key UI elements
- **Represents**: Trust, expertise, professionalism
- **Accessibility**: Excellent contrast with white text (WCAG AAA)
- **Variants**:
  - Light: `#3D4063` (Hover states)
  - Dark: `#1E2032` (Active states)

### Teal Accent `#1E91D6`
- **Usage**: Call-to-action buttons, important UI elements, links
- **Represents**: Technology, intelligence, clarity
- **Accessibility**: Good contrast with white text (WCAG AA)
- **Variants**:
  - Light: `#41A7E4` (Hover states) 
  - Dark: `#0C78BA` (Active states)

### Soft Coral `#FF8370`
- **Usage**: Highlights, secondary actions, success states
- **Represents**: Creativity, style, warmth
- **Accessibility**: Good contrast with dark text
- **Variants**:
  - Light: `#FF9F91` (Hover states)
  - Dark: `#E56B59` (Active states)

## Secondary Colors

### Light Silver `#EAEDF3`
- **Usage**: Page backgrounds, cards, containers
- **Represents**: Clean, fresh, modern
- **Variants**:
  - Darker: `#D9DEE8` (Alternative backgrounds, borders)

### Midnight `#171A31`
- **Usage**: Text, deep backgrounds for emphasis
- **Represents**: Sophistication, luxury, focus

### Sage Green `#78C091`
- **Usage**: Success messages, positive indicators
- **Represents**: Growth, harmony, approval
- **Variants**:
  - Light: `#92CDA6` (Hover states)
  - Dark: `#5EA977` (Active states)

## Neutral Colors

### Charcoal `#404258`
- **Usage**: Secondary text, icons
- **Accessibility**: Good contrast on light backgrounds

### Silver Gray `#A6A9B6`
- **Usage**: Disabled elements, subtle UI elements, borders
- **Accessibility**: Should not be used for important text

### Off-White `#F8F9FC`
- **Usage**: Page backgrounds, clean spaces
- **Represents**: Simplicity, clarity, space

## Functional Colors

### Success `#34C759`
- **Usage**: Success messages, confirmations

### Warning `#FFCC00`
- **Usage**: Warning messages, caution indicators

### Error `#FF3B30`
- **Usage**: Error messages, critical alerts
- **Accessibility**: Excellent contrast with white text

### Info `#5AC8FA`
- **Usage**: Informational messages, help indicators

## Gradients

### Premium Gradient
- **Direction**: 135 degrees
- **Colors**: `#2D3047` → `#1E91D6`
- **Usage**: Premium features, marketing materials

### Style Gradient
- **Direction**: 135 degrees
- **Colors**: `#1E91D6` → `#78C091`
- **Usage**: Feature highlights, section backgrounds

### Accent Gradient
- **Direction**: 135 degrees
- **Colors**: `#FF8370` → `#FFCC00`
- **Usage**: Special promotions, unique elements

## Color Application Guidelines

### Interface Hierarchy

1. **Primary Navigation**: Deep Indigo background with white text
2. **Content Areas**: Off-White or Light Silver backgrounds
3. **Call to Action**: Teal Accent buttons with white text
4. **Secondary Actions**: Outlined buttons with Teal Accent borders and text
5. **Results & Recommendations**: Cards with Light Silver background, Deep Indigo headers

### Typography Colors

- **Headlines**: Deep Indigo `#2D3047`
- **Body Text**: Charcoal `#404258`
- **Links**: Teal Accent `#1E91D6`
- **Secondary Text**: Silver Gray `#A6A9B6`
- **Inverted Text**: Off-White `#F8F9FC` (on dark backgrounds)

### Feature-Specific Colors

- **Face Shape Analysis**: Teal-based visualization
- **Recommendation Cards**: Soft Coral accents
- **Premium Features**: Premium Gradient backgrounds or borders
- **User Profile**: Light Silver background with Deep Indigo text

## Accessibility Considerations

- Maintain minimum contrast ratio of 4.5:1 for normal text (WCAG AA)
- Maintain minimum contrast ratio of 3:1 for large text and UI components
- Do not rely solely on color to convey information
- Provide alternative visual indicators (icons, patterns) alongside color coding

## Implementation Values

### HEX Values
```
--color-primary: #2D3047;
--color-primary-light: #3D4063;
--color-primary-dark: #1E2032;

--color-accent: #1E91D6;
--color-accent-light: #41A7E4;
--color-accent-dark: #0C78BA;

--color-secondary: #FF8370;
--color-secondary-light: #FF9F91;
--color-secondary-dark: #E56B59;

--color-background: #F8F9FC;
--color-card: #EAEDF3;
--color-card-alt: #D9DEE8;

--color-text: #171A31;
--color-text-secondary: #404258;
--color-text-tertiary: #A6A9B6;

--color-success: #34C759;
--color-warning: #FFCC00;
--color-error: #FF3B30;
--color-info: #5AC8FA;
```

### RGB Values
```
--color-primary-rgb: 45, 48, 71;
--color-accent-rgb: 30, 145, 214;
--color-secondary-rgb: 255, 131, 112;
--color-text-rgb: 23, 26, 49;
--color-background-rgb: 248, 249, 252;
```

### SCSS Variables
```scss
$color-primary: #2D3047;
$color-primary-light: #3D4063;
$color-primary-dark: #1E2032;

$color-accent: #1E91D6;
$color-accent-light: #41A7E4;
$color-accent-dark: #0C78BA;

$color-secondary: #FF8370;
$color-secondary-light: #FF9F91;
$color-secondary-dark: #E56B59;

$color-background: #F8F9FC;
$color-card: #EAEDF3;
$color-card-alt: #D9DEE8;

$color-text: #171A31;
$color-text-secondary: #404258;
$color-text-tertiary: #A6A9B6;

$color-success: #34C759;
$color-warning: #FFCC00;
$color-error: #FF3B30;
$color-info: #5AC8FA;

$gradient-premium: linear-gradient(135deg, $color-primary 0%, $color-accent 100%);
$gradient-style: linear-gradient(135deg, $color-accent 0%, #78C091 100%);
$gradient-accent: linear-gradient(135deg, $color-secondary 0%, $color-warning 100%);
```

## Color Psychology and Reasoning

- **Deep Indigo**: Chosen to convey expertise and professionalism while avoiding the coldness of pure navy or black
- **Teal Accent**: Represents the technological aspect of the app while feeling fresh and approachable
- **Soft Coral**: Adds warmth and creativity, making the styling aspect feel more personal and inviting
- **Overall Palette**: Balances technical confidence with style expertise, appealing to both practical and style-conscious users