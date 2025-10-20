import React, { useEffect, useState } from 'react'
import { Button, Form, Input, List, Space, Typography, message } from 'antd'
import axios from 'axios'

export type Task = {
  id?: string
  name: string
  owner: string
  command: string
  taskExecutions?: TaskExecution[]
}

export type TaskExecution = {
  startTime: string
  endTime: string
  output: string
}

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api' })

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/tasks')
      setTasks(res.data)
    } catch (e: any) {
      message.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onFinish = async (values: Task) => {
    try {
      await api.put('/tasks', values)
      message.success('Saved')
      await load()
    } catch (e: any) {
      message.error(e.response?.data || e.message)
    }
  }

  const remove = async (id?: string) => {
    if (!id) return
    await api.delete(`/tasks/${id}`)
    message.success('Deleted')
    await load()
  }

  const exec = async (id?: string) => {
    if (!id) return
    const res = await api.put(`/tasks/${id}/execute`)
    message.success('Executed: ' + (res.data?.output ?? '').toString().slice(0, 120))
    await load()
  }

  const find = async () => {
    if (!search) return load()
    try {
      const res = await api.get('/tasks/find', { params: { name: search } })
      setTasks(res.data)
    } catch (e: any) {
      message.error('Not found')
    }
  }

  return (
    <div className="min-h-screen w-full">
      {/* Gaming-Style Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl border-b-2 border-purple-500/50 shadow-2xl" style={{ 
        background: 'linear-gradient(180deg, rgba(16, 5, 35, 0.95) 0%, rgba(26, 11, 46, 0.95) 100%)',
        boxShadow: '0 0 30px rgba(139, 92, 246, 0.3), 0 10px 50px rgba(0, 0, 0, 0.8)'
      }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 shadow-2xl flex items-center justify-center text-white font-black text-3xl border-2 border-purple-400" style={{
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2)',
              animation: 'glow 3s ease-in-out infinite'
            }}>
              K
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-wider" style={{
              fontFamily: 'Orbitron, sans-serif',
              background: 'linear-gradient(135deg, #c4b5fd 0%, #f0abfc 50%, #c4b5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              animation: 'neon-pulse 2s ease-in-out infinite'
            }}>
              KAIBURR TASKS
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a className="px-6 py-3 rounded-lg font-bold uppercase tracking-wider border-2 border-purple-500 hover:border-pink-500 transition-all duration-300 hover:shadow-lg" 
               style={{
                 fontFamily: 'Teko, sans-serif',
                 fontSize: '18px',
                 color: '#c4b5fd',
                 background: 'rgba(16, 5, 35, 0.6)',
                 boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)'
               }}
               href="#tasks">
              TASKS
            </a>
            <a className="px-6 py-3 rounded-lg font-bold uppercase tracking-wider border-2 border-purple-500 hover:border-pink-500 transition-all duration-300 hover:shadow-lg" 
               style={{
                 fontFamily: 'Teko, sans-serif',
                 fontSize: '18px',
                 color: '#c4b5fd',
                 background: 'rgba(16, 5, 35, 0.6)',
                 boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)'
               }}
               href="#create">
              CREATE
            </a>
          </div>
        </div>
      </nav>

      {/* Gaming Hero Section */}
      <header className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-12">
        <div className="relative rounded-3xl p-12 md:p-24 text-center overflow-hidden border-4 border-purple-500/50" style={{
          background: 'linear-gradient(135deg, rgba(16, 5, 35, 0.9) 0%, rgba(26, 11, 46, 0.9) 50%, rgba(16, 5, 35, 0.9) 100%)',
          boxShadow: '0 0 50px rgba(139, 92, 246, 0.4), inset 0 0 80px rgba(139, 92, 246, 0.1), 0 20px 60px rgba(0, 0, 0, 0.8)'
        }}>
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at 30% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(219, 39, 119, 0.2) 0%, transparent 50%)'
          }} />
          <div className="relative z-10">
            <h2 className="text-6xl md:text-8xl font-black mb-8" style={{
              fontFamily: 'Orbitron, sans-serif',
              background: 'linear-gradient(135deg, #c4b5fd 0%, #f0abfc 25%, #fbbf24 50%, #f0abfc 75%, #c4b5fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '5px',
              textShadow: '0 0 40px rgba(139, 92, 246, 0.8), 0 0 80px rgba(139, 92, 246, 0.4)',
              filter: 'drop-shadow(0 10px 30px rgba(139, 92, 246, 0.6))'
            }}>
              COMMAND CENTER
            </h2>
            <p className="text-2xl md:text-3xl text-purple-200 max-w-4xl mx-auto leading-relaxed font-semibold mb-12" style={{
              fontFamily: 'Rajdhani, sans-serif',
              letterSpacing: '2px',
              textShadow: '0 0 10px rgba(139, 92, 246, 0.5)'
            }}>
              EXECUTE MISSIONS // MANAGE OPERATIONS // DOMINATE TASKS
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              <a
                href="#create"
                className="inline-flex items-center justify-center px-12 py-5 rounded-xl font-black text-xl uppercase tracking-widest border-3 transition-all duration-300 hover:-translate-y-2"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                  border: '3px solid #c4b5fd',
                  color: '#ffffff',
                  boxShadow: '0 0 30px rgba(139, 92, 246, 0.6), 0 10px 30px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '3px'
                }}
              >
                ⚡ NEW MISSION
              </a>
              <button
                className="inline-flex items-center justify-center px-12 py-5 rounded-xl font-black text-xl uppercase tracking-widest border-3 transition-all duration-300 hover:-translate-y-2"
                onClick={load}
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  background: 'rgba(30, 15, 50, 0.8)',
                  border: '3px solid #6366f1',
                  color: '#c4b5fd',
                  boxShadow: '0 0 25px rgba(99, 102, 241, 0.5), 0 10px 30px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '3px'
                }}
              >
                🔄 RELOAD
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Gaming Create/Update Section */}
      <section id="create" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-16">
        <div className="backdrop-blur-xl border-4 border-purple-500/50 rounded-3xl p-12 overflow-hidden relative" style={{
          background: 'linear-gradient(135deg, rgba(16, 5, 35, 0.85) 0%, rgba(26, 11, 46, 0.85) 100%)',
          boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), inset 0 0 60px rgba(139, 92, 246, 0.05), 0 15px 50px rgba(0, 0, 0, 0.7)'
        }}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" style={{
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)'
          }} />
          <div className="flex items-center gap-5 mb-10 pb-8 border-b-2 border-purple-500/40">
            <div className="h-3 w-20 rounded-full" style={{
              background: 'linear-gradient(90deg, #8b5cf6 0%, #d946ef 50%, #8b5cf6 100%)',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)'
            }} />
            <Typography.Title level={2} style={{ 
              color: '#e0d4ff', 
              margin: 0, 
              fontWeight: 900, 
              fontSize: '32px',
              fontFamily: 'Orbitron, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              textShadow: '0 0 20px rgba(139, 92, 246, 0.6)'
            }}>
              CREATE / UPDATE
            </Typography.Title>
          </div>
          
          <Form layout="vertical" onFinish={onFinish} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Form.Item name="id" label={<span className="text-white font-semibold text-base">Task ID (optional)</span>}>
                <Input placeholder="Leave blank for new task" className="h-14 rounded-2xl text-base" />
              </Form.Item>
              <Form.Item name="name" label={<span className="text-white font-semibold text-base">Task Name</span>} rules={[{ required: true, message: 'Please enter task name' }]}>
                <Input placeholder="My Task" className="h-14 rounded-2xl text-base" />
              </Form.Item>
              <Form.Item name="owner" label={<span className="text-white font-semibold text-base">Owner</span>} rules={[{ required: true, message: 'Please enter owner name' }]}>
                <Input placeholder="Your Name" className="h-14 rounded-2xl text-base" />
              </Form.Item>
              <Form.Item name="command" label={<span className="text-white font-semibold text-base">Command</span>} rules={[{ required: true, message: 'Please enter command' }]}>
                <Input placeholder="echo Hello World" className="h-14 rounded-2xl text-base" />
              </Form.Item>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="primary" htmlType="submit" size="large" className="h-14 px-12 rounded-2xl font-bold text-lg">
                💾 Save Task
              </Button>
            </div>
          </Form>

          <div className="mt-12 pt-12 border-t-2 border-purple-500/40 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500" style={{
              boxShadow: '0 0 20px rgba(20, 184, 166, 0.6)'
            }} />
            <div className="flex items-center gap-5 mb-8">
              <div className="h-3 w-20 rounded-full" style={{
                background: 'linear-gradient(90deg, #14b8a6 0%, #06b6d4 50%, #14b8a6 100%)',
                boxShadow: '0 0 20px rgba(20, 184, 166, 0.6)'
              }} />
              <Typography.Title level={3} style={{ 
                color: '#d4f5f2', 
                margin: 0, 
                fontWeight: 900, 
                fontSize: '28px',
                fontFamily: 'Orbitron, sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                textShadow: '0 0 15px rgba(20, 184, 166, 0.5)'
              }}>
                SEARCH MISSION
              </Typography.Title>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <Input
                placeholder="ENTER MISSION CODE..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="h-16 rounded-xl max-w-xl text-lg"
                prefix={<span className="text-purple-400 text-2xl">🔍</span>}
              />
              <Button size="large" onClick={find} className="h-16 px-10 rounded-xl font-bold text-lg">
                SEARCH
              </Button>
              <Button size="large" onClick={load} className="h-16 px-10 rounded-xl font-bold text-lg">
                RESET
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gaming Tasks List */}
      <section id="tasks" className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-20 mb-28">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className="h-3 w-20 rounded-full" style={{
              background: 'linear-gradient(90deg, #10b981 0%, #14b8a6 50%, #10b981 100%)',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)'
            }} />
            <Typography.Title level={2} style={{ 
              color: '#d4f5f2', 
              margin: 0, 
              fontWeight: 900, 
              fontSize: '36px',
              fontFamily: 'Orbitron, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              textShadow: '0 0 20px rgba(16, 185, 129, 0.6)'
            }}>
              ACTIVE MISSIONS
            </Typography.Title>
          </div>
          <div className="flex items-center gap-4 px-8 py-4 rounded-xl border-3 border-emerald-500/50" style={{
            background: 'rgba(16, 5, 35, 0.8)',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)'
          }}>
            <span className="text-emerald-300 text-lg font-bold uppercase tracking-wider" style={{fontFamily: 'Teko, sans-serif'}}>Total:</span>
            <span className="text-white text-3xl font-black" style={{fontFamily: 'Orbitron, sans-serif'}}>{tasks.length}</span>
          </div>
        </div>
        
        <div className="backdrop-blur-xl border-4 border-purple-500/50 rounded-3xl overflow-hidden relative" style={{
          background: 'linear-gradient(135deg, rgba(16, 5, 35, 0.85) 0%, rgba(26, 11, 46, 0.85) 100%)',
          boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), inset 0 0 60px rgba(139, 92, 246, 0.05), 0 15px 50px rgba(0, 0, 0, 0.7)'
        }}>
          {tasks.length === 0 && !loading ? (
            <div className="py-28 text-center">
              <div className="text-8xl mb-8">⚡</div>
              <p className="text-purple-200 text-2xl font-bold uppercase tracking-wider" style={{
                fontFamily: 'Rajdhani, sans-serif',
                textShadow: '0 0 15px rgba(139, 92, 246, 0.5)'
              }}>
                NO ACTIVE MISSIONS // START YOUR FIRST OPERATION
              </p>
            </div>
          ) : (
            <List
              loading={loading}
              dataSource={tasks}
              renderItem={(t) => (
                <List.Item
                  className="!border-purple-500/30 transition-all duration-200 !px-12 !py-10"
                  style={{
                    background: 'rgba(16, 5, 35, 0.4)',
                    borderBottom: '2px solid rgba(139, 92, 246, 0.3)'
                  }}
                  actions={[
                    <Button
                      key="run"
                      type="primary"
                      size="large"
                      className="!h-14 !px-10 !rounded-xl !font-bold !text-base"
                      onClick={() => exec(t.id)}
                    >
                      ⚡ EXECUTE
                    </Button>,
                    <Button
                      key="delete"
                      danger
                      size="large"
                      className="!h-14 !px-10 !rounded-xl !font-bold !text-base"
                      onClick={() => remove(t.id)}
                    >
                      � DESTROY
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div className="flex items-center gap-5 mb-4">
                        <span className="text-3xl font-black uppercase tracking-wide" style={{
                          fontFamily: 'Orbitron, sans-serif',
                          color: '#e0d4ff',
                          textShadow: '0 0 15px rgba(139, 92, 246, 0.5)'
                        }}>{t.name}</span>
                        <span className="px-5 py-2 text-base font-black uppercase tracking-wider rounded-lg border-2" style={{
                          fontFamily: 'Teko, sans-serif',
                          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(217, 70, 239, 0.3) 100%)',
                          color: '#f0abfc',
                          borderColor: '#c4b5fd',
                          boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
                        }}>
                          👤 {t.owner}
                        </span>
                      </div>
                    }
                    description={
                      <div className="space-y-5">
                        <div className="flex items-start gap-4">
                          <span className="text-purple-300 font-black uppercase tracking-wider text-lg" style={{fontFamily: 'Teko, sans-serif'}}>COMMAND:</span>
                          <code className="text-white px-5 py-3 rounded-xl font-mono text-lg border-2" style={{
                            background: 'rgba(10, 1, 24, 0.8)',
                            borderColor: '#8b5cf6',
                            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5), 0 0 15px rgba(139, 92, 246, 0.2)'
                          }}>
                            {t.command}
                          </code>
                        </div>
                        {t.taskExecutions && t.taskExecutions.length > 0 && (
                          <div className="rounded-xl p-6 border-2 space-y-4" style={{
                            background: 'rgba(10, 1, 24, 0.6)',
                            borderColor: '#10b981',
                            boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
                          }}>
                            <div className="flex items-center gap-4">
                              <span className="text-emerald-300 font-black uppercase tracking-wider text-lg" style={{fontFamily: 'Teko, sans-serif'}}>✓ EXECUTIONS:</span>
                              <span className="text-white font-black text-2xl" style={{fontFamily: 'Orbitron, sans-serif'}}>{t.taskExecutions.length}</span>
                            </div>
                            <div className="flex items-start gap-4">
                              <span className="text-cyan-300 font-black uppercase tracking-wider text-lg" style={{fontFamily: 'Teko, sans-serif'}}>OUTPUT:</span>
                              <code className="text-cyan-200 font-mono text-lg whitespace-pre-wrap font-semibold">
                                {t.taskExecutions[t.taskExecutions.length - 1].output || '(EMPTY)'}
                              </code>
                            </div>
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </section>

      {/* Gaming Footer */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
        <div className="backdrop-blur-xl border-4 border-purple-500/50 rounded-3xl p-10 relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, rgba(16, 5, 35, 0.9) 0%, rgba(26, 11, 46, 0.9) 100%)',
          boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), inset 0 0 60px rgba(139, 92, 246, 0.05)'
        }}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" style={{
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)'
          }} />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 flex items-center justify-center text-white font-black text-2xl border-2 border-purple-400 shadow-2xl" style={{
                boxShadow: '0 0 25px rgba(139, 92, 246, 0.6)',
                animation: 'glow 3s ease-in-out infinite'
              }}>
                K
              </div>
              <span className="text-purple-200 font-bold text-lg uppercase tracking-wider" style={{
                fontFamily: 'Teko, sans-serif',
                textShadow: '0 0 10px rgba(139, 92, 246, 0.4)'
              }}>
                © {new Date().getFullYear()} KAIBURR TASKS // COMMAND CENTER
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a 
                className="px-6 py-3 rounded-lg font-black uppercase tracking-wider border-2 border-cyan-500 hover:border-pink-500 transition-all duration-300" 
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: '14px',
                  color: '#a5f3fc',
                  background: 'rgba(16, 5, 35, 0.6)',
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)',
                  textShadow: '0 0 10px rgba(6, 182, 212, 0.5)'
                }}
                href="#top"
              >
                ⬆ RETURN TO BASE
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
