import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'memory-api',
      configureServer(server) {
        server.middlewares.use('/api/memory', (req, res) => {
          try {
            // Try multiple possible paths
            const possiblePaths = [
              '/Users/myclawbot/.openclaw/workspace/MEMORY.md',
              path.resolve(__dirname, '../.openclaw/workspace/MEMORY.md'),
              path.resolve(process.cwd(), '../.openclaw/workspace/MEMORY.md'),
            ]

            let memoryContent = null
            let foundPath = null
            for (const memoryPath of possiblePaths) {
              try {
                if (fs.existsSync(memoryPath)) {
                  memoryContent = fs.readFileSync(memoryPath, 'utf-8')
                  foundPath = memoryPath
                  console.log('✅ Found MEMORY.md at:', memoryPath)
                  break
                }
              } catch (e) {
                // Continue to next path
              }
            }

            if (!memoryContent) {
              console.error('❌ MEMORY.md not found, tried paths:', possiblePaths)
              res.statusCode = 404
              res.end(JSON.stringify({ error: 'MEMORY.md not found', paths: possiblePaths }))
              return
            }

            // Parse MEMORY.md to extract structured data
            const sections = memoryContent.split(/^##\s+/m)
            const memoryData: any = {}

            sections.forEach(section => {
              const lines = section.split('\n')
              const title = lines[0].trim()
              const content = lines.slice(1).join('\n').trim()

              if (title && content) {
                const timestamp = new Date().toISOString()
                const type = title.includes('##') ? 'memory' :
                            title.toLowerCase().includes('learn') ? 'learning' :
                            title.toLowerCase().includes('project') ? 'thinking' : 'memory'

                memoryData[title] = {
                  type,
                  importance: 0.7 + Math.random() * 0.3,
                  content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
                  timestamp
                }
              }
            })

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(memoryData))
          } catch (error) {
            console.error('Error reading MEMORY.md:', error)
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Failed to read memory' }))
          }
        })
      }
    }
  ],
  server: {
    host: true,
    port: 3000
  }
})
