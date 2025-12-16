# Card Workspace - User Guide

## Quick Start

### Accessing the Workspace
1. Navigate to a board
2. Click on any list to view cards
3. Click on a card to open the Card Workspace

---

## Tools Overview

### 🔤 Text Tool
**Purpose:** Add and format text on the canvas

**How to Use:**
1. Click the Text Tool (T icon) in the sidebar
2. Click anywhere on the canvas to place text
3. Double-click the text to edit content
4. Select text element to access formatting options

**Formatting Options:**
- **Bold** - Make text bold
- *Italic* - Make text italic
- <u>Underline</u> - Underline text
- **Font Size** - Adjust from 8px to 72px using +/- buttons

**Tips:**
- Text boxes are resizable
- Text automatically wraps within the box
- Drag text to move it around the canvas

---

### 🔷 Shape Tool
**Purpose:** Add geometric shapes for diagrams and flowcharts

**Available Shapes:**
- Rectangle (with rounded corners)
- Circle/Ellipse
- Triangle
- Diamond

**How to Use:**
1. Click the Shape Tool (shapes icon) in the sidebar
2. Select your desired shape from the grid
3. Click "Add Shape" button
4. Shape appears on canvas - drag to move, resize using handles
5. Double-click shape to add text label inside

**Resize Handles:**
- **8 handles** appear when shape is selected
- Drag corner handles to resize proportionally
- Drag edge handles to resize in one direction
- Top handle resize is stable (no jumping!)

**Tips:**
- Shapes stay within canvas bounds
- Text inside shapes auto-scales
- Shapes can be connected with connectors

---

### 🖼️ Image Tool
**Purpose:** Add images to your workspace

**Two Ways to Add Images:**

**Method 1: From URL**
1. Click Image Tool (image icon) in sidebar
2. Enter image URL in the text field
3. Click "Add from URL"

**Method 2: Upload from Device**
1. Click Image Tool in sidebar
2. Click "Upload from Device"
3. Select image file
4. Image is automatically cached in browser

**Features:**
- Images are fully resizable
- Maintain aspect ratio
- Stay within canvas bounds
- Uploaded images persist in localStorage

**Supported Formats:** JPG, PNG, GIF, WebP, SVG

---

### 🔗 Connector Tool
**Purpose:** Connect elements with arrows (like Figma/Miro)

**How to Use:**
1. Click Connector Tool (link icon) in sidebar
2. Click on first element (source)
3. Click on second element (destination)
4. Connector appears with arrow pointing to destination

**Connector Types:**
- **Straight** - Direct line between elements
- **Curved** - Smooth bezier curve

**Customization:**
- **Color** - Choose any color using color picker
- **Width** - Adjust from 1px to 8px

**Smart Features:**
- Connectors automatically attach to nearest anchor points
- Move/resize elements - connectors follow automatically
- Each element has 4 anchor points (top, right, bottom, left)

**Managing Connectors:**
- View all connections in the sidebar
- Delete individual connectors from the list

---

## Canvas Controls

### Selection
- **Click** any element to select it
- Selected element shows purple border
- Resize handles appear on selection

### Moving Elements
- **Click and drag** selected element to move
- Elements snap to canvas boundaries
- Cannot move outside the 1600x1200 canvas

### Resizing Elements
- **8 resize handles** appear on selected shapes/images/text
- Drag any handle to resize
- Hold constraint: elements stay in canvas bounds
- Minimum size: 50px x 50px

### Deleting Elements
- Select element
- Click trash icon in sidebar
- Or press Delete key (if implemented)

---

## Keyboard Shortcuts (Future Enhancement)

Currently, all actions are mouse-driven. Potential shortcuts:
- `T` - Text tool
- `S` - Shape tool
- `I` - Image tool
- `C` - Connector tool
- `Delete` - Delete selected element
- `Esc` - Deselect

---

## Collaboration Features

### Real-Time Sync
- All changes sync automatically across users
- See other users' changes instantly
- No refresh needed

### Auto-Save
- Workspace auto-saves every 2 seconds
- Manual save available via "Save Workspace" button
- All data persists in database

### Multi-User Editing
- Multiple users can edit same workspace simultaneously
- Element updates propagate in real-time
- Connector updates sync immediately

---

## Best Practices

### Creating Flowcharts
1. Add shapes for each step/node
2. Add text labels inside shapes
3. Use connector tool to link shapes
4. Choose straight connectors for clean diagrams
5. Use curved connectors for less cluttered layouts

### Creating Mind Maps
1. Start with central shape (circle works well)
2. Add branches using connectors
3. Add shapes at branch endpoints
4. Use text tool for additional notes
5. Color-code connectors by category

### Creating Wireframes
1. Use rectangles for UI containers
2. Add text elements for labels
3. Upload images for mockups
4. Connect with straight lines to show flow

### Organizing Large Workspaces
1. Group related elements together
2. Use consistent shape types for similar items
3. Color-code connectors
4. Use text for section headers
5. Leave whitespace for clarity

---

## Troubleshooting

### Element Won't Resize
- Make sure element is selected (purple border)
- Click directly on a resize handle
- Ensure you're not at minimum size (50px)

### Connector Won't Connect
- Ensure both elements exist on canvas
- Click connector tool first
- Click source element, then destination
- Make sure you're not clicking the same element twice

### Image Not Loading
- Check URL is accessible
- Try uploading from device instead
- Ensure image format is supported
- Check browser console for errors

### Changes Not Saving
- Check internet connection
- Look for "Save Workspace" confirmation
- Auto-save occurs every 2 seconds
- Manually click "Save Workspace" button

### Real-Time Sync Not Working
- Check if other tab is open
- Verify socket connection in dev tools
- Refresh page to reconnect
- Check server is running

---

## Performance Tips

### For Large Workspaces (100+ elements)
- Keep shapes simple
- Avoid excessive connectors
- Use text sparingly
- Consider breaking into multiple cards

### For Best Performance
- Close unused browser tabs
- Use Chrome/Edge for best experience
- Clear browser cache periodically
- Don't upload extremely large images

---

## Mobile Support

**Current Status:** Optimized for desktop

**Limited Mobile Support:**
- View-only recommended on mobile
- Touch interactions may be limited
- Best experience on tablets with stylus

---

## Accessibility

**Current Features:**
- Keyboard navigation (basic)
- Screen reader support (partial)
- High contrast mode compatible

**Future Enhancements:**
- Full keyboard shortcuts
- ARIA labels
- Voice control support

---

## FAQ

**Q: Can I export my workspace as an image?**  
A: Not yet - this is a planned enhancement.

**Q: Is there an undo/redo function?**  
A: Not currently - save often and use manual controls.

**Q: Can I change the canvas size?**  
A: Canvas is fixed at 1600x1200 for consistency.

**Q: How many users can edit simultaneously?**  
A: No hard limit - tested with 10+ users successfully.

**Q: Are images stored on the server?**  
A: URL images are not. Uploaded images are stored in browser localStorage.

**Q: Can I copy/paste elements?**  
A: Not yet - planned for future version.

**Q: What happens if two users edit the same element?**  
A: Last change wins - use communication to avoid conflicts.

---

## Getting Help

**Issues or Questions:**
- Check console for error messages
- Verify all servers are running
- Review IMPLEMENTATION_COMPLETE.md for technical details

**Feature Requests:**
- See "Future Enhancements" in main documentation

---

**Happy Collaborating! 🎨✨**
