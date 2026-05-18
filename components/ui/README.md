# UI Components Library

This directory contains reusable UI components that have been extracted from repetitive patterns across the codebase. All components follow consistent styling and behavior patterns.

## Components Overview

### 1. **Input** (`Input.tsx`)
Reusable text input component with label, error handling, and icon support.

**Props:**
- `label?: string` - Optional label text
- `error?: string` - Error message to display
- `icon?: React.ReactNode` - Optional left icon
- `helperText?: string` - Helper text below input
- All standard HTML input props

**Usage:**
```tsx
<Input
  id="email"
  name="email"
  type="email"
  label="Email Address"
  placeholder="you@example.com"
  error={errors.email}
  helperText="We'll never share your email"
/>
```

---

### 2. **Select** (`Select.tsx`)
Reusable select dropdown component.

**Props:**
- `label?: string` - Optional label text
- `error?: string` - Error message
- `options: SelectOption[]` - Array of {value, label} objects
- `helperText?: string` - Helper text
- All standard HTML select props

**Usage:**
```tsx
<Select
  label="Status"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]}
  value={status}
  onChange={handleChange}
/>
```

---

### 3. **Textarea** (`Textarea.tsx`)
Reusable textarea component with label and error handling.

**Props:**
- `label?: string` - Optional label text
- `error?: string` - Error message
- `helperText?: string` - Helper text
- All standard HTML textarea props

**Usage:**
```tsx
<Textarea
  label="Description"
  rows={5}
  placeholder="Enter description..."
  value={description}
  onChange={handleChange}
/>
```

---

### 4. **Checkbox** (`Checkbox.tsx`)
Reusable checkbox component with label.

**Props:**
- `label?: string | React.ReactNode` - Label text or JSX
- `error?: string` - Error message
- All standard HTML input checkbox props

**Usage:**
```tsx
<Checkbox
  id="terms"
  name="terms"
  checked={agreed}
  onChange={handleChange}
  label="I agree to the terms and conditions"
/>
```

---

### 5. **Button** (`Button.tsx`)
Versatile button component with multiple variants and loading state.

**Props:**
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'` - Button style
- `size?: 'sm' | 'md' | 'lg'` - Button size
- `isLoading?: boolean` - Show loading spinner
- `leftIcon?: React.ReactNode` - Icon on the left
- `rightIcon?: React.ReactNode` - Icon on the right
- `fullWidth?: boolean` - Full width button
- All standard HTML button props

**Usage:**
```tsx
<Button
  variant="primary"
  size="lg"
  isLoading={isSubmitting}
  fullWidth
  onClick={handleSubmit}
>
  Submit
</Button>
```

---

### 6. **Badge** (`Badge.tsx`)
Status badge component with predefined color variants.

**Props:**
- `variant?: 'success' | 'warning' | 'error' | 'info' | 'default'` - Badge color
- `children: React.ReactNode` - Badge content

**Helper Function:**
- `getStatusBadgeVariant(status: string): BadgeVariant` - Auto-determines variant from status text

**Usage:**
```tsx
<Badge variant="success">Active</Badge>
<Badge variant={getStatusBadgeVariant(patient.status)}>
  {patient.status}
</Badge>
```

---

### 7. **Avatar** (`Avatar.tsx`)
Circular avatar component displaying user initials.

**Props:**
- `name: string` - User's name (first letter used)
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Avatar size
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
<Avatar name="John Doe" size="md" />
```

---

### 8. **ProgressBar** (`ProgressBar.tsx`)
Progress bar component with optional label.

**Props:**
- `value: number` - Progress value (0-100)
- `showLabel?: boolean` - Show percentage label
- `size?: 'sm' | 'md' | 'lg'` - Bar height
- `color?: string` - Custom color class
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
<ProgressBar value={75} showLabel size="md" />
```

---

### 9. **StatCard** (`StatCard.tsx`)
Dashboard statistics card with icon, value, and optional progress bar.

**Props:**
- `label: string` - Card label
- `value: string | number` - Main value to display
- `icon?: React.ReactNode` - Icon element
- `change?: string` - Change indicator (e.g., "+12%")
- `color?: string` - Gradient color classes
- `bgColor?: string` - Background color class
- `showProgress?: boolean` - Show progress bar
- `progressValue?: number` - Progress bar value

**Usage:**
```tsx
<StatCard
  label="Total Patients"
  value="1,234"
  icon={<UserIcon />}
  change="+12%"
  color="from-blue-500 to-blue-600"
  showProgress
  progressValue={75}
/>
```

---

### 10. **FeatureList** (`FeatureList.tsx`)
List of features with checkmark icons (used in auth pages).

**Props:**
- `features: Feature[]` - Array of {text, icon?} objects
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
<FeatureList
  features={[
    { text: 'Secure & Private Sessions' },
    { text: 'Access Anytime, Anywhere' },
    { text: 'Personalized Care Plans' }
  ]}
/>
```

---

### 11. **StatsGrid** (`StatsGrid.tsx`)
Grid layout for displaying statistics (used in auth pages).

**Props:**
- `stats: Stat[]` - Array of {value, label} objects
- `columns?: 2 | 3 | 4` - Number of columns
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
<StatsGrid
  stats={[
    { value: '10K+', label: 'Active Users' },
    { value: '500+', label: 'Assistants' },
    { value: '4.9/5', label: 'Rating' }
  ]}
  columns={3}
/>
```

---

## Import Usage

All components can be imported from the index file:

```tsx
import {
  Input,
  Select,
  Textarea,
  Checkbox,
  Button,
  Badge,
  Avatar,
  ProgressBar,
  StatCard,
  FeatureList,
  StatsGrid,
  getStatusBadgeVariant
} from '@/components/ui';
```

---

## Design System

### Colors
- **Primary:** `#E67E3C` (Orange)
- **Primary Dark:** `#d16b2a`
- **Secondary:** `#4a3428` (Brown)
- **Success:** Green variants
- **Warning:** Yellow variants
- **Error:** Red variants

### Focus States
All form components use:
- `focus:ring-2 focus:ring-[#E67E3C]`
- `focus:border-transparent`

### Disabled States
- `disabled:bg-gray-100`
- `disabled:opacity-50`
- `disabled:cursor-not-allowed`

---

## Benefits of Refactoring

1. **Consistency:** All inputs, buttons, and UI elements look and behave the same
2. **Maintainability:** Update styling in one place, affects entire app
3. **Reusability:** Easy to use components across different pages
4. **Type Safety:** Full TypeScript support with proper prop types
5. **Accessibility:** Built-in ARIA attributes and keyboard navigation
6. **Reduced Code:** Significantly less repetitive code in page components

---

## Migration Guide

### Before (Old Pattern):
```tsx
<input
  type="email"
  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E67E3C] focus:border-transparent outline-none"
  placeholder="you@example.com"
/>
```

### After (New Pattern):
```tsx
<Input
  type="email"
  label="Email Address"
  placeholder="you@example.com"
/>
```

---

## Future Enhancements

Potential components to add:
- Modal/Dialog
- Dropdown Menu
- Tabs
- Toast Notifications
- Loading Spinner
- Card Container
- Table Component
- Pagination
- Search Input with Debounce
- Date Picker
- File Upload
