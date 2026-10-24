import {
  BriefcaseBusiness,
  Flag,
  FolderKanban,
  Heart,
  Pencil,
  Sparkles,
  Trash2,
  Check,
  CalendarDays,
} from 'lucide-react'

const categoryIcons = {
  งาน: BriefcaseBusiness,
  ส่วนตัว: Heart,
  ไอเดีย: Sparkles,
}

const categoryColors = {
  งาน: 'violet',
  ส่วนตัว: 'coral',
  ไอเดีย: 'amber',
}

export default function TodoItem({
  title,
  piority,
  dueDate,
  completed,
  onToggle,
  onDelete,
  onEdit,
  category,
}) {
  const CategoryIcon = categoryIcons[category] ?? FolderKanban
  const priorityClass =
    piority === 'สูง' ? 'high' : piority === 'ต่ำ' ? 'low' : 'medium'

  return (
    <article className={`task-card ${completed ? 'is-complete' : ''}`}>
      <button
        className={`task-check ${completed ? 'checked' : ''}`}
        onClick={onToggle}
        aria-label={completed ? 'ทำเครื่องหมายว่ายังไม่เสร็จ' : 'ทำเครื่องหมายว่าเสร็จแล้ว'}
      >
        {completed && <Check size={14} strokeWidth={3} />}
      </button>
      <div className="task-info">
        <h3>{title}</h3>
        <div className="task-meta">
          {category && (
            <span className={`task-category ${categoryColors[category] ?? 'violet'}`}>
              <CategoryIcon size={12} />{category}
            </span>
          )}
          {dueDate && (
            <span className="task-due">
              <CalendarDays size={12} />
              {new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short' }).format(
                new Date(`${dueDate}T00:00:00`),
              )}
            </span>
          )}
          <span className={`priority priority-${priorityClass}`}>
            <Flag size={11} />{piority}
          </span>
        </div>
      </div>
      <button className="delete-button" onClick={onDelete} aria-label={`ลบงาน ${title}`}>
        <Trash2 size={16} />
      </button>
      {onEdit && (
        <button className="edit-button" onClick={onEdit} aria-label={`แก้ไขงาน ${title}`}>
          <Pencil size={15} />
        </button>
      )}
    </article>
  )
}
