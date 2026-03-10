# Design Consistency Guide - Master Configuration Pages

This guide ensures consistent design patterns across all Master Configuration pages (Departments, Meeting Types, Venues, Staff) in the Minutes of Meeting application.

## Standard View Modal Structure

All view modals MUST follow this exact structure for consistency:

### 1. Modal Container

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
  <div className="bg-gradient-to-br from-[#1f1f1f] via-[#1a1a1a] to-[#151515] border border-gray-800/50 rounded-2xl w-full max-w-2xl shadow-2xl shadow-[color]-500/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
```

**Properties:**

- Width: `max-w-2xl` (standard for all)
- Background: Gradient from dark to darker
- Border: `border-gray-800/50`
- Shadow: Colored shadow matching entity theme (orange for venues, blue for meeting-types, etc.)

### 2. Modal Header

```tsx
<div className="relative p-6 pb-4 border-b border-gray-800/50">
  <div className="flex items-start gap-4">
    <div className="w-14 h-14 bg-gradient-to-br from-[color1]-500 to-[color2]-500 rounded-xl flex items-center justify-center shrink-0">
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div className="flex-1">
      <h2 className="text-2xl font-bold text-white mb-1">{entity.name}</h2>
      {/* Optional subtitle for code or secondary info */}
    </div>
  </div>

  <button
    onClick={closeModal}
    className="absolute top-6 right-6 text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-all"
  >
    <X size={20} />
  </button>
</div>
```

**Properties:**

- Padding: `p-6 pb-4`
- Icon: `w-14 h-14` container, `w-7 h-7` icon
- Title: `text-2xl font-bold`
- Close button: `size={20}`, positioned `top-6 right-6`

### 3. Modal Body

```tsx
<div className="p-6 space-y-6">
```

**Padding & Spacing:**

- Padding: `p-6`
- Section spacing: `space-y-6`

#### Section Order (MUST follow this order):

1. **Entity Information Section**
2. **User Information Section** (Created By / Modified By)
3. **Remarks Section** (conditional)
4. **Statistics Section**

### 4. Entity Information Section

Display the primary fields of the entity in a grid:

```tsx
{
  /* [Entity] Information */
}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
      [Field Name]
    </label>
    <p className="text-lg text-white font-medium">{entity.fieldValue}</p>
  </div>

  {/* Additional fields as needed */}
</div>;
```

**Properties:**

- Grid: `grid-cols-1 md:grid-cols-2` (responsive)
- Gap: `gap-6`
- Each field wrapper: `space-y-2`
- Label: `text-sm font-semibold text-gray-400 uppercase tracking-wider`
- Value: `text-lg text-white font-medium`
- Use conditional rendering for optional fields

### 5. User Information Section (MANDATORY)

**IMPORTANT:** This section MUST be included in ALL view modals and MUST NOT use conditional rendering.

```tsx
{
  /* User Information */
}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
      Created By
    </label>
    <p className="text-base text-white font-medium">
      {entity.createdBy || "System"}
    </p>
  </div>

  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
      Modified By
    </label>
    <p className="text-base text-white font-medium">
      {entity.modifiedBy || "-"}
    </p>
  </div>
</div>;
```

**Properties:**

- Grid: `grid-cols-1 md:grid-cols-2`
- Gap: `gap-6`
- Each field wrapper: `space-y-2`
- Label: `text-sm font-semibold text-gray-400 uppercase tracking-wider`
- Value: `text-base text-white font-medium`
- **Created By fallback:** `"System"`
- **Modified By fallback:** `"-"`
- ⚠️ **ALWAYS display** - never use conditional rendering on this section

### 6. Remarks Section

```tsx
{
  /* Remarks */
}
{
  entity.remarks && (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        Remarks
      </label>
      <p className="text-white bg-[#0f0f0f] rounded-lg p-4 border border-gray-800">
        {entity.remarks}
      </p>
    </div>
  );
}
```

**Properties:**

- Wrapper: `space-y-2`
- Label: `text-sm font-semibold text-gray-400 uppercase tracking-wider`
- Value container: `bg-[#0f0f0f] rounded-lg p-4 border border-gray-800`
- ✅ Use conditional rendering (only show if remarks exist)

### 7. Statistics Section

Display counts and timestamps in a consistent card grid:

```tsx
{
  /* Statistics */
}
<div className="grid grid-cols-2 md:grid-cols-[number] gap-4">
  {/* Count Cards with Icons */}
  <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
    <div className="flex items-center gap-2 text-gray-400 mb-2">
      <Icon size={16} />
      <span className="text-sm font-medium">[Label]</span>
    </div>
    <p className="text-2xl font-bold text-white">{entity._count?.field || 0}</p>
  </div>

  {/* Created Timestamp Card */}
  <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
    <div className="text-gray-400 mb-2">
      <span className="text-sm font-medium">Created</span>
    </div>
    <p className="text-sm font-semibold text-white">
      {new Date(entity.created).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}
    </p>
    <p className="text-xs text-gray-400 mt-1">
      {new Date(entity.created).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}
    </p>
  </div>

  {/* Modified Timestamp Card */}
  <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
    <div className="text-gray-400 mb-2">
      <span className="text-sm font-medium">Modified</span>
    </div>
    <p className="text-sm font-semibold text-white">
      {entity.modified
        ? new Date(entity.modified).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "-"}
    </p>
    {entity.modified && (
      <p className="text-xs text-gray-400 mt-1">
        {new Date(entity.modified).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}
      </p>
    )}
  </div>
</div>;
```

**Properties:**

- Grid: `grid-cols-2 md:grid-cols-[3 or 4]` depending on number of statistics
- Gap: `gap-4`
- Card: `bg-[#0f0f0f] rounded-xl p-4 border border-gray-800`
- Count cards: Include icon with `size={16}`
- Count value: `text-2xl font-bold text-white`
- Timestamp date: `text-sm font-semibold text-white`
- Timestamp time: `text-xs text-gray-400 mt-1`
- **Modified date:** Show `"-"` if null
- **Modified time:** Conditional rendering (only show if modified exists)
- ⚠️ **ALWAYS display both Created and Modified cards** - don't hide Modified card

## Entity-Specific Grid Columns

### Departments

- **Statistics Grid:** `grid-cols-2 md:grid-cols-4`
- **Cards:** Staff (icon), Meetings (icon), Created, Modified

### Meeting Types

- **Statistics Grid:** `grid-cols-2 md:grid-cols-3`
- **Cards:** Meetings (icon), Created, Modified

### Venues

- **Statistics Grid:** `grid-cols-2 md:grid-cols-4`
- **Cards:** Capacity (icon), Meetings (icon), Created, Modified

### Staff

- **Statistics Grid:** Varies based on available data
- Cards include relevant counts and timestamps

## Action Buttons

### Icon Sizes

- **Cards/Modals:** `iconSize={18}`
- **Tables:** `iconSize={16}`

### Colors (Defined in ActionButtons component)

```tsx
export const ICON_STYLES = {
  view: "text-emerald-400 hover:text-emerald-300",
  edit: "text-blue-400 hover:text-blue-300",
  delete: "text-red-400 hover:text-red-300",
};
```

### Usage

```tsx
import { ActionButtons } from "@/app/components/ActionButtons";

<ActionButtons
  onView={() => handleView(item)}
  onEdit={() => handleEdit(item)}
  onDelete={() => handleDelete(item)}
  iconSize={18}
/>;
```

## Module Color Schemes

| Module        | Icon       | Gradient Colors |
| ------------- | ---------- | --------------- |
| Departments   | Building2  | Orange to Red   |
| Meeting Types | ListChecks | Blue to Indigo  |
| Venues        | MapPin     | Orange to Red   |
| Staff         | Users      | Orange to Red   |

## Delete Confirmation Modal

```tsx
<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 max-w-sm w-full">
    <div className="text-center">
      <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Trash2 className="w-6 h-6 text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Delete [Entity]</h3>
      <p className="text-gray-400 mb-6">
        Are you sure you want to delete{" "}
        <strong className="text-white">{item.name}</strong>?
      </p>
      <div className="flex gap-3">
        <button className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
          Cancel
        </button>
        <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors">
          Delete
        </button>
      </div>
    </div>
  </div>
</div>
```

## Consistency Checklist

When creating or updating a view modal, verify:

- [ ] Modal width is `max-w-2xl`
- [ ] Header padding is `p-6 pb-4`
- [ ] Icon is `w-14 h-14` with `w-7 h-7` icon inside
- [ ] Title is `text-2xl font-bold`
- [ ] Body padding is `p-6`
- [ ] Body spacing is `space-y-6`
- [ ] Entity Information section exists with proper styling
- [ ] User Information section (Created By/Modified By) is ALWAYS displayed
- [ ] Created By fallback is "System"
- [ ] Modified By fallback is "-"
- [ ] Remarks section uses conditional rendering
- [ ] Statistics section exists with appropriate grid columns
- [ ] Created and Modified cards are ALWAYS displayed
- [ ] Modified date shows "-" when null
- [ ] Modified time uses conditional rendering
- [ ] ActionButtons component is used with correct iconSize
- [ ] Color scheme matches module theme
- [ ] All text sizes and spacing match the standard

## Common Mistakes to Avoid

❌ **Don't:** Use conditional rendering for User Information section
✅ **Do:** Always display Created By/Modified By with fallback values

❌ **Don't:** Hide the Modified timestamp card completely
✅ **Do:** Always show the card, display "-" for date if null

❌ **Don't:** Use inconsistent padding/spacing values
✅ **Do:** Use `p-6` and `space-y-6` for modal body

❌ **Don't:** Mix text sizes (e.g., text-xs for Created By labels)
✅ **Do:** Use `text-sm` for labels, `text-base` for values in User Information

❌ **Don't:** Make modal width different (e.g., max-w-md)
✅ **Do:** Use `max-w-2xl` for all master configuration view modals

## Notes

- This guide is based on the implemented pattern in Meeting Types and Departments pages
- All future pages should follow this exact structure
- When in doubt, reference the meeting-types/page.tsx view modal implementation
- Consistency across all pages is critical for user experience
