---
status: closed
severity: minor
target: none
owner: maintenance
opened: 2026-09-27
closed: 2026-09-27
requirements: []
---

# Bug: Flaky Desktop Dropdown Menu ("Clubul Nostru")

## Symptom

In the desktop layout, the dropdown menu under "Clubul Nostru" was flaky and frequently closed inadvertently. When the cursor moved from the "Clubul Nostru" trigger button downward toward the dropdown menu panel, the cursor crossed a gap between the button and panel, causing the `:hover` state to be lost and the dropdown to disappear before the user could click any item. Furthermore, clicking "Clubul Nostru" did not toggle or pin the dropdown open.

## Environment

- Component: `ag-flash3.8-site/src/layouts/Layout.astro`
- Branch: `ws-maintenance/flaky-dropdown-menu`

## Reproduction

1. Open website in desktop viewport (> 1024px).
2. Hover over "Clubul Nostru" to display the dropdown.
3. Move mouse cursor downward toward "Despre Noi" or "Antrenori".
4. If cursor moves slightly diagonally or across the margin gap, hover is lost and dropdown collapses immediately.
5. Clicking "Clubul Nostru" does not pin or lock the dropdown in an open state.

Expected:
1. Hovering allows seamless transit between the button and dropdown panel without collapsing (invisible hover bridge).
2. Clicking "Clubul Nostru" toggles the dropdown into a persistent open state until clicked again, clicked outside, or `Escape` is pressed.
3. ARIA attributes (`aria-expanded`, `aria-haspopup`) communicate state for accessibility.

Actual:
Dropdown relied solely on CSS `:hover` with a gap (`mt-1`) and no click-toggle behavior.

## Resolution & Close Verification

1. **Hover Transit Bridge**:
   - Replaced margin gap with `top-full pt-2` and an invisible hit-zone overlay connecting the bottom of the button directly to the dropdown panel.
   - Cursor movement between button and menu is now continuously contained within the interactive hit area, preventing unintended closure.
2. **Click-to-Pin Mode**:
   - Added click listener on `club-dropdown-btn` that toggles `isPinned = true`.
   - When pinned, `mouseleave` does not close the dropdown, keeping it open in non-disappearing mode.
   - Clicking "Clubul Nostru" again toggles it closed.
3. **Dismissal & Accessibility**:
   - Document click listener closes the menu when clicking anywhere outside the container.
   - Keyboard listener closes the menu on `Escape` and refocuses the button.
   - `aria-expanded` and `aria-haspopup` updated dynamically.
4. **Active Subpage Styling**:
   - Added `isClubActive` check to highlight "Clubul Nostru" when navigating any of its child pages.
5. **Build Verification**:
   - Ran `npm run build`: 19 pages built in 1.72s with 0 errors and 0 warnings.

## Close Criteria

Done means:
1. An invisible hover bridge is added between trigger and dropdown panel, eliminating flicker on cursor transit.
2. Clicking "Clubul Nostru" toggles persistent open state (non-disappearing mode).
3. Clicking outside the dropdown closes it.
4. Pressing Escape closes the dropdown.
5. Proper `aria-expanded` and `aria-haspopup` attributes are set.
6. Build succeeds cleanly with 0 errors and 0 warnings (`npm run build`).

Verification:
- Verify build with `npm run build`.
- Checked event listeners for click toggle, outside click, and hover bridge.

Reopen if:
The dropdown collapses prematurely during cursor movement or click toggle fails to persist.
