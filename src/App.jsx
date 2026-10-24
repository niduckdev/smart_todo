import { useMemo, useState } from 'react'
import {
  ArrowDownWideNarrow,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  Clock3,
  Coffee,
  Heart,
  LayoutDashboard,
  ListTodo,
  Plus,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import TodoItem from './components/TodoItem.jsx'

const categories = [
  { id: 'งาน', label: 'งาน', color: 'violet', Icon: BriefcaseBusiness },
  { id: 'ส่วนตัว', label: 'ส่วนตัว', color: 'coral', Icon: Heart },
  { id: 'ไอเดีย', label: 'ไอเดีย', color: 'amber', Icon: Sparkles },
]

const initialTasks = [
  {
    id: 1,
    title: 'เตรียมสไลด์นำเสนอโปรเจกต์ Smart City',
    category: 'งาน',
    dueDate: '',
    priority: 'สูง',
    completed: false,
  },
  {
    id: 2,
    title: 'ส่งสรุปการประชุมให้ทีม',
    category: 'งาน',
    dueDate: '',
    priority: 'ปานกลาง',
    completed: false,
  },
  {
    id: 3,
    title: 'อ่านหนังสือให้จบ 1 บท',
    category: 'ส่วนตัว',
    dueDate: '',
    priority: 'ต่ำ',
    completed: true,
  },
  {
    id: 4,
    title: 'คิดไอเดียคอนเทนต์สำหรับสัปดาห์หน้า',
    category: 'ไอเดีย',
    dueDate: '',
    priority: 'ปานกลาง',
    completed: false,
  },
]

const filters = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'active', label: 'ยังไม่เสร็จ' },
  { id: 'completed', label: 'เสร็จแล้ว' },
]

function loadTasks() {
  try {
    const stored = localStorage.getItem('smart-todo-tasks')
    if (!stored) return initialTasks
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : initialTasks
  } catch (error) {
    console.error('ไม่สามารถอ่านรายการงานที่บันทึกไว้ได้', error)
    return initialTasks
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด')
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('งาน')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('ปานกลาง')

  const persistTasks = (nextTasks) => {
    setTasks(nextTasks)
    try {
      localStorage.setItem('smart-todo-tasks', JSON.stringify(nextTasks))
    } catch (error) {
      console.error('ไม่สามารถบันทึกรายการงานได้', error)
    }
  }

  const completeCount = tasks.filter((task) => task.completed).length
  const today = new Intl.DateTimeFormat('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('th')
    return tasks.filter((task) => {
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'active' && !task.completed) ||
        (activeFilter === 'completed' && task.completed)
      const matchesCategory =
        activeCategory === 'ทั้งหมด' || task.category === activeCategory
      const matchesSearch =
        !normalizedQuery ||
        task.title.toLocaleLowerCase('th').includes(normalizedQuery)
      return matchesFilter && matchesCategory && matchesSearch
    })
  }, [tasks, activeFilter, activeCategory, query])

  const toggleTask = (id) => {
    persistTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const deleteTask = (id) => {
    persistTasks(tasks.filter((task) => task.id !== id))
  }

  const openNewTaskForm = () => {
    setEditingTaskId(null)
    setTitle('')
    setCategory('งาน')
    setDueDate('')
    setPriority('ปานกลาง')
    setShowForm(true)
  }

  const openEditTaskForm = (task) => {
    setEditingTaskId(task.id)
    setTitle(task.title)
    setCategory(task.category)
    setDueDate(task.dueDate ?? '')
    setPriority(task.priority)
    setShowForm(true)
  }

  const closeTaskForm = () => {
    setShowForm(false)
    setEditingTaskId(null)
  }

  const saveTask = (event) => {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    if (editingTaskId !== null) {
      persistTasks(
        tasks.map((task) =>
          task.id === editingTaskId
            ? { ...task, title: cleanTitle, category, dueDate, priority }
            : task,
        ),
      )
    } else {
      persistTasks([
        {
          id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
          title: cleanTitle,
          category,
          dueDate,
          priority,
          completed: false,
        },
        ...tasks,
      ])
    }
    closeTaskForm()
  }

  const categoryCount = (categoryId) =>
    tasks.filter((task) => task.category === categoryId && !task.completed)
      .length

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Smart Todo หน้าแรก">
          <span className="brand-mark"><CheckCheck size={21} strokeWidth={2.5} /></span>
          <span className="brand-name">smart<span>todo</span></span>
        </a>

        <div className="workspace-switcher">
          <div className="workspace-avatar">S</div>
          <div className="workspace-copy">
            <span>พื้นที่ทำงาน</span>
            <strong>My workspace</strong>
          </div>
          <ChevronDown size={16} className="muted-icon" />
        </div>

        <nav className="side-nav" aria-label="เมนูหลัก">
          <p className="nav-heading">เมนู</p>
          <button
            className={`nav-link ${activeCategory === 'ทั้งหมด' ? 'selected' : ''}`}
            onClick={() => setActiveCategory('ทั้งหมด')}
          >
            <LayoutDashboard size={18} /><span>ภาพรวม</span>
          </button>
          <button
            className={`nav-link ${activeFilter === 'all' ? 'selected-subtle' : ''}`}
            onClick={() => { setActiveCategory('ทั้งหมด'); setActiveFilter('all') }}
          >
            <ListTodo size={18} /><span>งานทั้งหมด</span>
            <span className="nav-count">{tasks.length}</span>
          </button>
          <button className="nav-link" onClick={() => { setActiveCategory('ทั้งหมด'); setActiveFilter('active') }}>
            <CalendarDays size={18} /><span>วันนี้</span>
            <span className="nav-count">{tasks.filter((task) => !task.completed).length}</span>
          </button>
          <button className="nav-link" onClick={() => { setActiveCategory('ทั้งหมด'); setActiveFilter('completed') }}>
            <Check size={18} /><span>เสร็จแล้ว</span>
          </button>

          <div className="nav-section">
            <p className="nav-heading">หมวดหมู่ <button aria-label="เพิ่มหมวดหมู่"><Plus size={15} /></button></p>
            {categories.map(({ id, label, color, Icon }) => (
              <button
                key={id}
                className={`nav-link category-link ${activeCategory === id ? 'selected-subtle' : ''}`}
                onClick={() => { setActiveCategory(id); setActiveFilter('all') }}
              >
                <span className={`category-icon ${color}`}><Icon size={14} /></span>
                <span>{label}</span>
                <span className="nav-count">{categoryCount(id)}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon"><Sparkles size={16} /></span>
            <strong>ก้าวเล็ก ๆ ก็สำคัญ</strong>
            <p>ทุกงานที่ทำสำเร็จ คืออีกก้าวที่เข้าใกล้เป้าหมาย</p>
          </div>
          <button className="profile">
            <div className="profile-avatar">N</div>
            <span><strong>สวัสดี, คุณ</strong><small>บัญชีส่วนตัว</small></span>
            <ChevronDown size={16} className="muted-icon" />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>พื้นที่ทำงาน</span><span className="crumb-slash">/</span><strong>ภาพรวม</strong></div>
          <div className="topbar-actions">
            <label className="search-box">
              <Search size={17} />
              <input
                type="search"
                placeholder="ค้นหางาน..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="ค้นหางาน"
              />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button notification-button" aria-label="การแจ้งเตือน">
              <Bell size={18} /><i />
            </button>
            <div className="top-avatar">N</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="date-label"><CalendarDays size={15} />{today}</div>
              <h1>สวัสดีตอนเช้า <span className="wave">☀️</span></h1>
              <p className="welcome-subtitle">พร้อมเริ่มต้นวันดี ๆ และทำเป้าหมายให้สำเร็จหรือยัง?</p>
            </div>
            <button className="primary-button" onClick={openNewTaskForm}>
              <Plus size={18} strokeWidth={2.5} /> เพิ่มงานใหม่
            </button>
          </section>

          <section className="overview-grid" aria-label="สรุปงาน">
            <article className="overview-card total-card">
              <div className="overview-top">
                <span className="overview-icon total-icon"><ListTodo size={19} /></span>
                <span className="overview-caption">งานทั้งหมด</span>
                <span className="trend-pill"><ArrowDownWideNarrow size={13} /> วันนี้</span>
              </div>
              <div className="metric-row"><strong>{tasks.length}</strong><span>งาน</span></div>
              <div className="metric-foot">งานที่อยู่ในรายการของคุณ</div>
            </article>
            <article className="overview-card progress-card">
              <div className="overview-top">
                <span className="overview-icon progress-icon"><CheckCheck size={19} /></span>
                <span className="overview-caption">เสร็จแล้ว</span>
                <span className="metric-mini">{completeCount}/{tasks.length}</span>
              </div>
              <div className="metric-row"><strong>{completeCount}</strong><span>งาน</span></div>
              <div className="progress-track"><span style={{ width: `${tasks.length ? (completeCount / tasks.length) * 100 : 0}%` }} /></div>
            </article>
            <article className="overview-card pending-card">
              <div className="overview-top">
                <span className="overview-icon pending-icon"><Clock3 size={19} /></span>
                <span className="overview-caption">กำลังดำเนินการ</span>
                <span className="pulse-dot" />
              </div>
              <div className="metric-row"><strong>{tasks.length - completeCount}</strong><span>งาน</span></div>
              <div className="metric-foot">คุณทำได้ดีมาก สู้ต่อไปนะ!</div>
            </article>
          </section>

          <section className="tasks-section">
            <div className="section-heading">
              <div>
                <div className="heading-title-row"><h2>{activeCategory === 'ทั้งหมด' ? 'งานของฉัน' : activeCategory}</h2><span className="task-total">{visibleTasks.length} งาน</span></div>
                <p>จัดการทุกสิ่งที่ต้องทำในวันนี้</p>
              </div>
              <button className="sort-button"><ArrowDownWideNarrow size={16} /> ล่าสุด <ChevronDown size={14} /></button>
            </div>

            <div className="task-toolbar">
              <div className="filter-tabs" role="tablist" aria-label="กรองรายการงาน">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    role="tab"
                    aria-selected={activeFilter === filter.id}
                    className={activeFilter === filter.id ? 'active' : ''}
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.label}
                    {filter.id === 'active' && <span className="filter-count">{tasks.filter((task) => !task.completed).length}</span>}
                  </button>
                ))}
              </div>
              <button className="mobile-add" onClick={openNewTaskForm} aria-label="เพิ่มงาน"><Plus size={19} /></button>
            </div>

            <div className="task-list">
              {visibleTasks.map((task) => {
                return (
                  <TodoItem
                    key={task.id}
                    title={task.title}
                    piority={task.priority}
                    dueDate={task.dueDate}
                    completed={task.completed}
                    category={task.category}
                    onToggle={() => toggleTask(task.id)}
                    onDelete={() => deleteTask(task.id)}
                    onEdit={() => openEditTaskForm(task)}
                  />
                )
              })}
              {visibleTasks.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon"><Coffee size={23} /></div>
                  <strong>{query ? 'ไม่พบงานที่ค้นหา' : 'ยังไม่มีงานในรายการนี้'}</strong>
                  <p>{query ? 'ลองค้นหาด้วยคำอื่น หรือปรับตัวกรองดูนะ' : 'เพิ่มงานใหม่ แล้วเริ่มทำเป้าหมายให้สำเร็จกันเลย'}</p>
                  {!query && <button onClick={openNewTaskForm}><Plus size={16} /> เพิ่มงานแรกของคุณ</button>}
                </div>
              )}
            </div>
            {tasks.length > 0 && (
              <button className="view-all-button" onClick={() => { setActiveFilter('all'); setActiveCategory('ทั้งหมด') }}>
                ดูงานทั้งหมด <ArrowRight size={15} />
              </button>
            )}
          </section>

          <footer className="page-footer"><span>ทำทีละอย่าง แล้วคุณจะไปได้ไกลกว่าที่คิด</span><span className="footer-heart">♥</span></footer>
        </div>
      </main>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeTaskForm() }}>
          <section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-heading">
              <div><span className="modal-kicker">{editingTaskId !== null ? 'ปรับรายละเอียดงาน' : 'เพิ่มสิ่งที่ต้องทำ'}</span><h2 id="modal-title">{editingTaskId !== null ? 'แก้ไขงาน' : 'สร้างงานใหม่'}</h2></div>
              <button className="icon-button" onClick={closeTaskForm} aria-label="ปิด"><X size={19} /></button>
            </div>
            <form onSubmit={saveTask}>
              <label className="form-label" htmlFor="task-title">ชื่องาน</label>
              <input
                id="task-title"
                className="form-input"
                autoFocus
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="เช่น อ่านหนังสือ 30 นาที"
                required
                maxLength={120}
              />
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label" htmlFor="task-category">หมวดหมู่</label>
                  <select id="task-category" className="form-input" value={category} onChange={(event) => setCategory(event.target.value)}>
                    {categories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label className="form-label" htmlFor="task-priority">ความสำคัญ</label>
                  <select id="task-priority" className="form-input" value={priority} onChange={(event) => setPriority(event.target.value)}>
                    <option>ต่ำ</option><option>ปานกลาง</option><option>สูง</option>
                  </select>
                </div>
              </div>
              <label className="form-label" htmlFor="task-date">วันครบกำหนด <span className="optional-label">ไม่บังคับ</span></label>
              <input id="task-date" className="form-input date-input" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
              <div className="modal-actions">
                <button type="button" className="cancel-button" onClick={closeTaskForm}>ยกเลิก</button>
                <button type="submit" className="primary-button">{editingTaskId !== null ? <Check size={17} /> : <Plus size={17} />}{editingTaskId !== null ? 'บันทึกการแก้ไข' : 'บันทึกงาน'}</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
