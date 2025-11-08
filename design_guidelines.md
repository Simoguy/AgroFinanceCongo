# Design Guidelines: Agro_finance_congo

## Design Approach
**System**: Material Design 3 - optimized for mobile-first data management with clear information hierarchy and efficient interactions for field agents.

**Rationale**: This utility-focused financial application requires consistency, clarity, and efficiency. Material Design provides robust patterns for data-heavy mobile applications with proven touch targets and navigation patterns.

## Typography
- **Primary Font**: Inter (Google Fonts)
- **Hierarchy**:
  - Page Titles: text-2xl font-bold
  - Section Headers: text-lg font-semibold
  - Category Buttons: text-base font-medium
  - List Items: text-sm font-normal
  - Labels/Captions: text-xs font-medium uppercase tracking-wide
  - Financial Amounts: text-lg font-bold (tabular-nums for alignment)

## Layout System
**Spacing Scale**: Use Tailwind units of 2, 4, 6, and 8 for consistency
- Container padding: p-4
- Section spacing: space-y-6
- Card padding: p-4
- Button padding: px-6 py-3
- List item spacing: space-y-2

**Grid System**:
- Home category buttons: 2x3 grid (grid-cols-2 gap-4)
- Client lists: Single column with dividers
- Forms: Single column with grouped fields

## Component Library

### Bottom Navigation (Fixed)
- 3 items: Home, Add, Profile
- Height: h-16 with safe-area-inset-bottom
- Icons above labels, active state with filled icons
- Touch target: minimum 48px height

### Category Buttons (Home Page)
- Large card-style buttons in 2-column grid
- Icon at top, label below
- Height: h-32 for comfortable touch
- Each button shows count badge when applicable
- Subtle elevation with shadow-sm

### Client Lists
- Avatar/initial circle (48px) on left
- Name as primary text (text-base font-medium)
- Status/amount as secondary text (text-sm)
- Right-aligned amount with status indicator
- Swipe actions for quick operations
- Dividers between items

### Tabs (Épargne & Soldé sections)
- Full-width segmented control style
- Equal width tabs
- Active tab with bottom border indicator (h-1)
- Height: h-12

### Forms (Add Page)
- Type selector at top (3 chips/pills)
- Grouped input fields with clear labels above
- Input height: h-12
- Floating labels for active inputs
- Helper text below inputs (text-xs)
- Primary action button fixed at bottom

### Statistics Cards (Performance)
- Metric value large (text-3xl font-bold)
- Metric label small (text-sm)
- 2-column grid for metrics
- Cards with subtle borders

### Profile Page
- Avatar at top center (96px)
- Agent name and ID below
- Information in grouped sections with headers
- Action buttons stacked vertically

### Search & Filter Bar
- Search input with icon
- Filter button with badge count
- Height: h-12
- Sticky positioning when scrolling

### Floating Action Button (FAB)
- Used sparingly for primary actions
- Position: bottom-right with margin from bottom nav
- Size: 56px diameter

## Interaction Patterns
- Pull-to-refresh on list views
- Swipe-to-delete on list items with confirmation
- Bottom sheets for filters and secondary actions
- Toast notifications for confirmations
- Loading skeletons for data fetching

## Data Display
- Financial amounts right-aligned with tabular numbers
- Status indicators using colored dots (8px)
- Date formats: DD/MM/YYYY
- Currency: always show "FC" or appropriate symbol
- Large tap targets for all interactive elements (minimum 44x44px)

## Page-Specific Layouts

**Home Page**:
- Header with agent greeting and notification icon
- 6 category buttons in 2x3 grid
- Quick stats summary above categories

**Client Detail View**:
- Header with back button and client name
- Summary cards for balances
- Transaction history list
- Action buttons at bottom

**Add Forms**:
- Progressive disclosure for complex inputs
- Validation messages inline
- Submit button always visible (sticky bottom)

## Accessibility & Performance
- All interactive elements minimum 44x44px
- Clear focus states for keyboard navigation
- Sufficient contrast ratios throughout
- Optimistic UI updates for offline-first functionality
- Lazy loading for long lists with infinite scroll

## Images
This application requires minimal imagery:
- **Profile avatars**: Placeholder initials in colored circles when no photo available
- **Empty states**: Simple illustrations (150x150px) for empty lists with clear messaging
- **No hero images**: This is a utility application focused on data management