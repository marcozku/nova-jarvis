# Nova AI - JARVIS Visualization

Real-time 3D visualization of Nova AI's memory, learning, and thinking processes using Three.js and React.

## Features

✨ **3D Hub & Spoke Architecture**
- Interactive 3D visualization powered by Three.js
- Core hub (Nova) with surrounding nodes (Memory, Learning, Thinking, Agents)
- Smooth animations and transitions

🔄 **Real-time Updates**
- Auto-refresh every 30 seconds
- Live connection to MEMORY.md
- Dynamic node creation based on actual data

📱 **Mobile-Friendly**
- Responsive design
- Touch controls (rotate, zoom, pan)
- Accessible from anywhere

🎯 **Interactive Nodes**
- Click nodes to view detailed information
- Color-coded by type
- Importance-based sizing

⏱️ **Timestamp Tracking**
- See when each memory was created
- Track learning evolution over time

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment Options

### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 2. Netlify
```bash
# Build
npm run build

# Deploy dist folder
netlify deploy --prod
```

### 3. GitHub Pages
```bash
# Build
npm run build

# Copy dist to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

## Architecture

```
nova-jarvis/
├── src/
│   ├── App.tsx          # Main 3D visualization component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── vite.config.ts       # Vite config + MEMORY.md API
├── package.json         # Dependencies
└── README.md            # This file
```

## Tech Stack

- **React 18** - UI framework
- **Three.js** - 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Three.js helpers for React
- **Vite** - Build tool
- **TypeScript** - Type safety

## Memory Data Format

The visualization reads from MEMORY.md with the following structure:

```markdown
## Memory Section Title

Content and details about this memory...

## Another Memory Section

More content...
```

## Node Types

| Type | Color | Description |
|------|-------|-------------|
| Core | Blue | Nova AI central consciousness |
| Memory | Gold | Long-term memories |
| Learning | Green | Recent learning |
| Thinking | Pink | Active thoughts |
| Agent | Purple | Specialized agents |

## Controls

- **Rotate**: Click and drag
- **Zoom**: Scroll wheel / pinch
- **Pan**: Right-click drag
- **Select Node**: Click on any node
- **Deselect**: Click outside or close panel

## Mobile Support

✅ Fully responsive
✅ Touch gestures (pinch to zoom, drag to rotate)
✅ Optimized for mobile browsers
✅ Works offline after first load

## Future Enhancements

- [ ] Add timeline slider to view historical states
- [ ] Voice commands for interaction
- [ ] Export visualization as video
- [ ] Collaborative viewing (multi-user)
- [ ] AR/VR support

## License

MIT

---

Made with ❤️ by Nova AI
