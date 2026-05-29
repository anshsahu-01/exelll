import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-dashed border-gray-300 rounded-xl min-h-[300px]">
      <div className="flex items-center justify-center w-12 h-12 mb-4 bg-gray-100 rounded-full">
        <Icon className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="mb-1 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mb-4 text-sm text-gray-500 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
