// Simple Express server for Railway deployment
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Mock API endpoint for memory data
app.get('/api/memory', (req, res) => {
  // Return mock data since we don't have access to MEMORY.md on Railway
  const mockMemory = {
    "About Marco": {
      type: "memory",
      importance: 0.85,
      content: "Marco - AI enthusiast, developer, timezone: Asia/Hong_Kong",
      timestamp: new Date().toISOString()
    },
    "Active Projects": {
      type: "thinking",
      importance: 0.90,
      content: "OpenClaw Skills, Nova Jarvis 3D visualization, Railway deployment",
      timestamp: new Date().toISOString()
    },
    "Tech Stack": {
      type: "learning",
      importance: 0.75,
      content: "Next.js, FastAPI, PostgreSQL, Railway, Docker, Three.js",
      timestamp: new Date().toISOString()
    },
    "AI Tools": {
      type: "agent",
      importance: 0.80,
      content: "OpenClaw, Claude, Gemini - Building AI-powered workflows",
      timestamp: new Date().toISOString()
    }
  };
  
  res.json(mockMemory);
});

// Fallback to index.html for SPA routing - must be last
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Nova Jarvis running on port ${PORT}`);
});
