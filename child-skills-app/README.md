# Child Skills Audit App

A mobile-first web application for auditing and tracking children's skills across different age ranges.

## Features

- **Age-based chapters**: Skills organized by age (3-16 years)
- **Individual tracking**: Track which people can perform each skill
- **Progress tracking**: See current progress within each chapter (e.g., "3/10")
- **Chapter summaries**: View statistics after completing each age range
- **Final summary**: See overall audit results across all ages
- **localStorage persistence**: Progress is automatically saved and restored
- **Age range navigation**: Jump to any age range at any time
- **Mobile-first design**: Optimized for use on mobile devices

## Getting Started

### Installation

```bash
cd child-skills-app
npm install
```

### Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Building for Production

```bash
npm run build
```

## Configuration

### Customizing People/Participants

Edit `src/config.json` to customize the list of people being audited:

```json
{
  "people": ["Alice", "Bob", "Charlie"]
}
```

Replace the names with the actual people you want to track. You can use first names, handles, or any identifiers you prefer.

### Customizing Skills Data

The skills data is stored in `src/source-categories.json`. The file structure is:

```json
{
  "skills_by_age": {
    "3": [
      {
        "skill": "Dress self",
        "description": "Put on clothes independently..."
      }
    ],
    "4": [...]
  }
}
```

You can modify, add, or remove skills and age ranges as needed.

## How to Use

### Starting an Audit

1. Open the app and you'll see the first age range intro card
2. Click "Start Chapter" to begin reviewing skills for that age
3. For each skill, you can either:
   - Click "All of us can do this!" if everyone can do the skill
   - Select individual people who can do the skill
4. Progress automatically moves to the next skill after recording a response

### Navigation

- **Menu button**: Access age range navigation and settings
- **Jump to Age**: Click any age number to skip to that chapter
- **Progress indicator**: Shows current position in chapter (e.g., "Age 5 - 3/10")

### Viewing Results

- **Chapter Summary**: Appears after completing all skills in an age range
  - Shows skills reviewed count
  - Shows skills per person for that chapter
- **Final Summary**: Appears after completing all age ranges
  - Shows total skills reviewed across all ages
  - Shows total skills per person

### Managing Progress

- Progress is automatically saved to your browser's localStorage
- Close and reopen the app to continue where you left off
- Click "Reset All Progress" to start a fresh audit

## Technical Details

- Built with React and Vite
- No backend required - runs entirely in the browser
- Progress stored in localStorage
- Mobile-first responsive design

## Browser Compatibility

Works on all modern browsers that support:
- localStorage API
- ES6+ JavaScript
- CSS Grid and Flexbox

