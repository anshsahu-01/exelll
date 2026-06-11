'use client'

import { useRouter } from 'next/navigation'
import { X, Lock } from 'lucide-react'

interface LoginRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  action?: string
}

export function LoginRequiredModal({ isOpen, onClose, action = 'perform this action' }: LoginRequiredModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm mx-4 bg-surface rounded-2xl border border-border-default shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-7 h-7 text-primary" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary">Login Required</h2>
            <p className="mt-2 text-sm text-secondary">
              You need to be signed in to {action}.
            </p>
          </div>

          <div className="flex flex-col w-full gap-3 mt-2">
            <button
              onClick={() => router.push('/sign-in')}
              className="w-full py-3 rounded-xl bg-primary text-background font-semibold text-sm transition-all hover:bg-primary/90 active:scale-95"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/sign-up')}
              className="w-full py-3 rounded-xl border border-border-default text-primary font-semibold text-sm transition-all hover:bg-surface-hover active:scale-95"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
