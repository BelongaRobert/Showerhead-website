# Dr. Droppy × Loop Subscription Widget Design

Use this with **Loop admin → Acquire → Widget** (V2).  
Theme CSS `assets/loop-widget.css` already skins the app block to match the site.

---

## Look & feel (match product buy box)

| Token | Value | Use |
| --- | --- | --- |
| Ink / borders | `#0F2C59` | Borders, headings, selected outlines |
| Soft text | `#4A5F7A` | Descriptions, helper copy |
| Sky accent | `#89D6F2` | Selected fills, badges, CTA chips |
| Soft blue | `#E9F7FC` | Hover backgrounds |
| White | `#FFFFFF` | Card background |
| Radius | `18px` outer / `999px` chips | Match theme cards & pills |
| Fonts | Figtree (body), Sora (titles) | Same as theme |

Visual target: same language as the **DR. DROPPY’S FAVORITE** plan card — white card, navy outline, sky highlight on selection, pill badges.

<img reference: generated mock lives at `/opt/cursor/artifacts/assets/loop-widget-mock.png`>

---

## Loop admin — recommended setup

### Layout
- **Widget type:** Radio group (clearest for one-time vs subscribe)
- **Frequency selector:** Buttons (not dropdown) — reads like theme chips
- **Purchase option order:** One-time first, then Subscribe (or reverse if you want subscribe default)

### Preferences
- Show discount badge: **On**
- Strikethrough compare-at on subscribe: **On** (if you use a discount)
- Default selection: **One-time** for launch (safer), or Subscribe if you want aggressive attach
- Don’t hide widget when only one plan exists: **Off** (keep visible)

### Styles (paste into Loop Styles where fields exist)

- Background: `#FFFFFF`
- Border color: `#0F2C59`
- Border width: `2px`
- Border radius: `18px`
- Selected background: `#89D6F2` (or soft mix `#D5F1FB`)
- Selected text: `#0F2C59`
- Badge background: `#89D6F2`
- Badge text: `#0F2C59`
- Frequency button radius: `999px`
- Frequency selected: fill `#89D6F2`, border `#0F2C59`

### Custom CSS (Loop → Styles → Custom CSS)

Paste this **in addition to** theme `loop-widget.css` if Loop’s sandbox needs it:

```css
.loop-widget,
.loop-widget-container,
[class*="loop-widget"] {
  font-family: Figtree, "Helvetica Neue", sans-serif !important;
  color: #0F2C59 !important;
  background: #fff !important;
  border: 2px solid #0F2C59 !important;
  border-radius: 18px !important;
  padding: 14px 16px !important;
  box-shadow: 0 14px 28px rgba(15, 44, 89, 0.06) !important;
}

[class*="badge"],
[class*="save"] {
  background: #89D6F2 !important;
  color: #0F2C59 !important;
  border: 2px solid #0F2C59 !important;
  border-radius: 999px !important;
  font-weight: 700 !important;
}

button,
[class*="frequency"] {
  border: 2px solid #0F2C59 !important;
  border-radius: 999px !important;
  background: #fff !important;
  color: #0F2C59 !important;
  font-weight: 700 !important;
}

button[aria-pressed="true"],
.selected,
.active {
  background: #89D6F2 !important;
}
```

### Texts (brand voice)

| Field | Suggested copy |
| --- | --- |
| One-time label | `One-time purchase` |
| Subscribe label | `Subscribe & Save` |
| Plan group title | `Delivery every` |
| Badge | `Dr. Droppy’s pick` or `Save 15%` (once discount locked) |
| Frequency 90 days | `Every 90 days` (filter swap cadence) |
| Helper under subscribe | `Auto-refill filters. Skip or cancel anytime.` |
| Details link | `What’s included` |

---

## Theme placement (already done)

On `cursor/shopify-theme-36e5`:

1. Product template → **Product buy box** supports `@app` blocks  
2. App blocks render **above Add to cart**  
3. `loop-widget.css` is loaded site-wide for styling

### Add the widget in Shopify
1. Publish / preview the theme branch  
2. Theme editor → Product page → Product buy box → **Add block → Apps → Loop**  
3. Loop admin → map widget → Refresh status  

---

## Owner decisions still needed
- Subscribe discount %  
- Frequencies (recommend starting with **90 days** for filter cartridge)  
- Which SKUs (shower head vs refill cartridge) are subscription-eligible  

Until those are locked, use placeholder **15%** / **Every 90 days** in Loop and update later.
