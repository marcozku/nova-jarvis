import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Text, Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'

// Node types
type NodeType = 'core' | 'memory' | 'learning' | 'thinking' | 'agent'

interface Node {
  id: string
  label: string
  type: NodeType
  importance: number
  content?: string
  timestamp?: string
  position: [number, number, number]
  connections: string[]
}

interface MemoryData {
  [key: string]: {
    type: NodeType
    importance: number
    content: string
    timestamp: string
  }
}

// Colors for each node type
const NODE_COLORS = {
  core: '#64c8ff',
  memory: '#ffd700',
  learning: '#00ff88',
  thinking: '#ff6b9d',
  agent: '#9b59b6'
}

// 3D Node Component
function Node3D({ node, onClick, isSelected }: { node: Node; onClick: (node: Node) => void; isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 2 + node.id.length) * 0.1
      )
    }
  })

  const color = NODE_COLORS[node.type]
  const scale = hovered || isSelected ? 1.2 : 1

  return (
    <group position={node.position}>
      {/* Outer glow */}
      <Sphere ref={meshRef} args={[node.importance * 0.3 + 0.5, 32, 32]} scale={scale}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Inner core */}
      <Sphere args={[0.2, 16, 16]}>
        <meshBasicMaterial color="#fff" />
      </Sphere>

      {/* Label */}
      <Text
        position={[0, node.importance * 0.3 + 0.7, 0]}
        fontSize={0.2}
        color="#fff"
        anchorX="center"
        anchorY="middle"
      >
        {node.label}
      </Text>

      {/* Invisible hitbox for better interaction */}
      <Sphere
        args={[1, 8, 8]}
        visible={false}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          onClick(node)
        }}
      />
    </group>
  )
}

// Connection Line Component
function Connection({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end])

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      opacity={0.3}
      transparent
    />
  )
}

// Main Scene Component
function Scene({ nodes, selectedNode, onNodeClick }: { nodes: Node[]; selectedNode: Node | null; onNodeClick: (node: Node) => void }) {
  const coreNode = nodes.find(n => n.type === 'core')
  const otherNodes = nodes.filter(n => n.type !== 'core')

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#64c8ff" />

      {/* Core Node */}
      {coreNode && <Node3D node={coreNode} onClick={onNodeClick} isSelected={selectedNode?.id === coreNode.id} />}

      {/* Other Nodes */}
      {otherNodes.map((node) => (
        <Node3D
          key={node.id}
          node={node}
          onClick={onNodeClick}
          isSelected={selectedNode?.id === node.id}
        />
      ))}

      {/* Connections */}
      {otherNodes.map((node) => {
        if (!coreNode) return null
        return (
          <Connection
            key={node.id}
            start={coreNode.position}
            end={node.position}
            color={NODE_COLORS[node.type]}
          />
        )
      })}

      {/* Controls */}
      <OrbitControls enableZoom enablePan enableRotate />
    </>
  )
}

// Main App Component
export default function App() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    model: 'Claude Sonnet 4.5',
    tokens: '143k / 200k',
    context: '72%',
    lastUpdate: new Date().toLocaleTimeString()
  })

  // Load memory data
  useEffect(() => {
    const loadMemoryData = async () => {
      try {
        setLoading(true)

        // Fetch memory data from your actual MEMORY.md
        const response = await fetch('/api/memory')
        const memoryData: MemoryData = await response.json()

        // Convert memory data to nodes
        const coreNode: Node = {
          id: 'nova-core',
          label: 'NOVA',
          type: 'core',
          importance: 1,
          content: 'Nova AI Core',
          timestamp: new Date().toISOString(),
          position: [0, 0, 0],
          connections: []
        }

        const categoryAngles = {
          memory: 0,
          learning: Math.PI / 2,
          thinking: Math.PI,
          agent: (3 * Math.PI) / 2
        }

        const otherNodes: Node[] = Object.entries(memoryData).map(([label, data], index) => {
          const categoryNodes = Object.entries(memoryData).filter(
            ([, d]) => d.type === data.type
          )
          const categoryIndex = categoryNodes.findIndex(([l]) => l === label)
          const categoryCount = categoryNodes.length
          const baseAngle = categoryAngles[data.type] || 0
          const angle = baseAngle + (categoryIndex / categoryCount) * (Math.PI / 2) - Math.PI / 4
          const distance = data.type === 'memory' ? 3 : data.type === 'learning' ? 4 : data.type === 'thinking' ? 5 : 6

          return {
            id: `${data.type}-${label}`,
            label,
            type: data.type,
            importance: data.importance,
            content: data.content,
            timestamp: data.timestamp,
            position: [
              Math.cos(angle) * distance,
              (Math.random() - 0.5) * 2,
              Math.sin(angle) * distance
            ],
            connections: ['nova-core']
          }
        })

        setNodes([coreNode, ...otherNodes])
        setLoading(false)
      } catch (error) {
        console.error('Failed to load memory data:', error)
        setLoading(false)

        // Fallback demo data
        const demoData: MemoryData = {
          'Today': { type: 'memory', importance: 0.8, content: 'Daily logs and activities', timestamp: new Date().toISOString() },
          'Skills': { type: 'memory', importance: 0.9, content: 'Installed skills and capabilities', timestamp: new Date().toISOString() },
          'Projects': { type: 'memory', importance: 0.7, content: 'Active projects and tasks', timestamp: new Date().toISOString() },
          'User Preferences': { type: 'memory', importance: 0.95, content: 'Marco\'s preferences and settings', timestamp: new Date().toISOString() },
          'Railway Deployment': { type: 'learning', importance: 0.85, content: 'Learned Railway deployment and Prisma 7', timestamp: new Date().toISOString() },
          'Version History': { type: 'learning', importance: 0.75, content: 'Implemented version history feature', timestamp: new Date().toISOString() },
          'Problem Solving': { type: 'thinking', importance: 0.9, content: 'Solved API routes and deployment issues', timestamp: new Date().toISOString() }
        }

        const coreNode: Node = {
          id: 'nova-core',
          label: 'NOVA',
          type: 'core',
          importance: 1,
          content: 'Nova AI Core',
          timestamp: new Date().toISOString(),
          position: [0, 0, 0],
          connections: []
        }

        const categoryAngles = {
          memory: 0,
          learning: Math.PI / 2,
          thinking: Math.PI,
          agent: (3 * Math.PI) / 2
        }

        const otherNodes: Node[] = Object.entries(demoData).map(([label, data], index) => {
          const categoryNodes = Object.entries(demoData).filter(
            ([, d]) => d.type === data.type
          )
          const categoryIndex = categoryNodes.findIndex(([l]) => l === label)
          const categoryCount = categoryNodes.length
          const baseAngle = categoryAngles[data.type] || 0
          const angle = baseAngle + (categoryIndex / categoryCount) * (Math.PI / 2) - Math.PI / 4
          const distance = data.type === 'memory' ? 3 : data.type === 'learning' ? 4 : data.type === 'thinking' ? 5 : 6

          return {
            id: `${data.type}-${label}`,
            label,
            type: data.type,
            importance: data.importance,
            content: data.content,
            timestamp: data.timestamp,
            position: [
              Math.cos(angle) * distance,
              (Math.random() - 0.5) * 2,
              Math.sin(angle) * distance
            ],
            connections: ['nova-core']
          }
        })

        setNodes([coreNode, ...otherNodes])
      }
    }

    loadMemoryData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadMemoryData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)' }}
      >
        {loading ? (
          <Text position={[0, 0, 0]} fontSize={0.5} color="#64c8ff">
            Loading Nova AI...
          </Text>
        ) : (
          <Scene nodes={nodes} selectedNode={selectedNode} onNodeClick={setSelectedNode} />
        )}
      </Canvas>

      {/* UI Overlay - Top Left Stats */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(100, 200, 255, 0.3)',
        borderRadius: 12,
        padding: 20,
        zIndex: 10,
        minWidth: 250
      }}>
        <h2 style={{ color: '#64c8ff', marginBottom: 15, fontSize: 14, letterSpacing: 2 }}>🤖 NOVA AI STATUS</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0', fontSize: 12 }}>
          <span style={{ color: '#888' }}>Model:</span>
          <span style={{ color: '#64c8ff', fontWeight: 'bold' }}>{stats.model}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0', fontSize: 12 }}>
          <span style={{ color: '#888' }}>Tokens:</span>
          <span style={{ color: '#64c8ff', fontWeight: 'bold' }}>{stats.tokens}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0', fontSize: 12 }}>
          <span style={{ color: '#888' }}>Context:</span>
          <span style={{ color: '#64c8ff', fontWeight: 'bold' }}>{stats.context}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0', fontSize: 12 }}>
          <span style={{ color: '#888' }}>Last Update:</span>
          <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{stats.lastUpdate}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0', fontSize: 12 }}>
          <span style={{ color: '#888' }}>Total Nodes:</span>
          <span style={{ color: '#64c8ff', fontWeight: 'bold' }}>{nodes.length}</span>
        </div>
      </div>

      {/* UI Overlay - Node Details Panel */}
      {selectedNode && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(10px)',
          border: `2px solid ${NODE_COLORS[selectedNode.type]}`,
          borderRadius: 12,
          padding: 20,
          zIndex: 10,
          minWidth: 300,
          maxWidth: 400
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <h2 style={{ color: NODE_COLORS[selectedNode.type], fontSize: 18, margin: 0 }}>
              {selectedNode.label}
            </h2>
            <button
              onClick={() => setSelectedNode(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: 20,
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: 10 }}>
            <span style={{
              padding: '4px 12px',
              background: NODE_COLORS[selectedNode.type] + '30',
              border: `1px solid ${NODE_COLORS[selectedNode.type]}`,
              borderRadius: 20,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}>
              {selectedNode.type}
            </span>
          </div>

          {selectedNode.content && (
            <div style={{ marginTop: 15 }}>
              <div style={{ color: '#888', fontSize: 12, marginBottom: 5 }}>CONTENT</div>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>{selectedNode.content}</div>
            </div>
          )}

          {selectedNode.timestamp && (
            <div style={{ marginTop: 15 }}>
              <div style={{ color: '#888', fontSize: 12, marginBottom: 5 }}>TIMESTAMP</div>
              <div style={{ fontSize: 12, color: '#64c8ff' }}>
                {new Date(selectedNode.timestamp).toLocaleString('zh-TW')}
              </div>
            </div>
          )}

          <div style={{ marginTop: 15 }}>
            <div style={{ color: '#888', fontSize: 12, marginBottom: 5 }}>IMPORTANCE</div>
            <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
              <div
                style={{
                  width: `${selectedNode.importance * 100}%`,
                  height: '100%',
                  background: NODE_COLORS[selectedNode.type],
                  borderRadius: 4,
                  transition: 'width 0.3s'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* UI Overlay - Legend */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(100, 200, 255, 0.3)',
        borderRadius: 12,
        padding: 15,
        zIndex: 10,
        fontSize: 11
      }}>
        <div style={{ marginBottom: 10, fontWeight: 'bold', color: '#64c8ff' }}>NODE TYPES</div>
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${color}, ${color}40)`,
              marginRight: 8
            }} />
            <span style={{ textTransform: 'capitalize' }}>{type}</span>
          </div>
        ))}
      </div>

      {/* UI Overlay - Instructions */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(100, 200, 255, 0.3)',
        borderRadius: 12,
        padding: 15,
        zIndex: 10,
        fontSize: 11,
        color: '#888'
      }}>
        <div style={{ marginBottom: 5, fontWeight: 'bold', color: '#64c8ff' }}>CONTROLS</div>
        <div>🖱️ Drag to rotate</div>
        <div>🔍 Scroll to zoom</div>
        <div>👆 Click nodes for details</div>
        <div>🔄 Auto-refresh every 30s</div>
      </div>
    </div>
  )
}
