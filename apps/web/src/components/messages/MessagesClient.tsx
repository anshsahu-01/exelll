'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Loader2, Search, Send, MessageSquare } from 'lucide-react'
import { ConversationDetail, ConversationListItem, ChatMessage } from '@/types'
import {
  getConversationById,
  getConversations,
  sendConversationMessage,
} from '@/lib/marketplace'

function formatTime(value: string) {
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(
    new Date(value)
  )
}

function formatAgo(value: string) {
  const diff = Date.now() - new Date(value).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

function Avatar({ name, image }: { name: string; image: string | null }) {
  return image ? (
    <Image src={image} alt={name} width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
  ) : (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-hover text-sm font-semibold text-secondary">
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export function MessagesClient({ activeId }: { activeId?: string }) {
  const router = useRouter()
  const { getToken } = useAuth()
  const [conversations, setConversations] = useState<ConversationListItem[]>([])
  const [activeConversation, setActiveConversation] = useState<ConversationDetail | null>(null)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(activeId ?? null)
  const [loadingList, setLoadingList] = useState(true)
  const [loadingThread, setLoadingThread] = useState(Boolean(activeId))
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [sending, setSending] = useState(false)

  const filteredConversations = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return conversations
    return conversations.filter((conversation) =>
      [conversation.otherUser.name, conversation.productTitle, conversation.lastMessage?.content ?? '']
        .join(' ')
        .toLowerCase()
        .includes(term)
    )
  }, [conversations, search])

  const loadConversations = async () => {
    try {
      setError(null)
      setLoadingList(true)
      const token = await getToken()
      const data = await getConversations(token ?? undefined)
      setConversations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load conversations')
    } finally {
      setLoadingList(false)
    }
  }

  const loadThread = async (conversationId: string) => {
    try {
      setLoadingThread(true)
      const token = await getToken()
      const data = await getConversationById(conversationId, token ?? undefined)
      setActiveConversation(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load conversation')
      setActiveConversation(null)
    } finally {
      setLoadingThread(false)
    }
  }

  useEffect(() => {
    void loadConversations()
  }, [])

  useEffect(() => {
    if (activeId) {
      setSelectedConversationId(activeId)
      void loadThread(activeId)
    } else {
      setActiveConversation(null)
      setSelectedConversationId(null)
    }
  }, [activeId])

  const handleSend = async () => {
    if (!selectedConversationId || !message.trim()) return
    const content = message.trim()
    try {
      setSending(true)
      const token = await getToken()
      const sent = await sendConversationMessage(selectedConversationId, content, token ?? undefined)
      setMessage('')
      setActiveConversation((current) =>
        current
          ? {
              ...current,
              messages: [...current.messages, { ...sent, isMine: true }],
              userMessageCount: sent.userMessageCount,
              remainingMessages: sent.remainingMessages,
              isMessageLimitReached: sent.isMessageLimitReached,
            }
          : current
      )
      await loadConversations()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send message')
    } finally {
      setSending(false)
    }
  }

  const openConversation = async (conversationId: string) => {
    setSelectedConversationId(conversationId)
    setError(null)
    await loadThread(conversationId)
    if (activeId) {
      router.replace(`/messages/${conversationId}`)
    } else {
      router.push(`/messages/${conversationId}`)
    }
  }

  const activeConversationSummary = activeConversation ?? null
  const remainingMessages = activeConversationSummary?.remainingMessages ?? 0
  const maxAllowedMessages = activeConversationSummary?.maxAllowedMessages ?? 20
  const isMessageLimitReached = activeConversationSummary?.isMessageLimitReached ?? false
  const isYellowWarning = remainingMessages <= 10 && remainingMessages > 5
  const isOrangeWarning = remainingMessages <= 5 && remainingMessages > 3
  const isRedWarning = remainingMessages <= 3 && remainingMessages > 0
  const limitBannerClass = isRedWarning
    ? 'border-red-200 bg-red-50 text-red-700'
    : isOrangeWarning
      ? 'border-orange-200 bg-orange-50 text-orange-700'
      : isYellowWarning
        ? 'border-yellow-200 bg-yellow-50 text-yellow-800'
        : isMessageLimitReached
          ? 'border-red-200 bg-red-50 text-red-700'
          : 'border-border-default bg-surface-hover text-secondary'

  const showThreadOnly = Boolean(activeId)

  return (
    <div className="h-[calc(100dvh-4rem)] overflow-hidden bg-background">
      <div
        className={`grid h-full min-h-0 ${
          showThreadOnly ? 'grid-rows-[minmax(0,1fr)] lg:grid-cols-[30%_70%] lg:grid-rows-none' : 'grid-rows-[minmax(0,1fr)] lg:grid-cols-[30%_70%] lg:grid-rows-none'
        }`}
      >
      <aside className={`${showThreadOnly ? 'hidden lg:flex' : 'flex'} min-h-0 flex-col border-b border-border-default bg-surface lg:border-b-0 lg:border-r`}>
        <div className="sticky top-0 z-10 border-b border-border-default bg-surface p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-border-default bg-surface-hover px-3">
            <Search className="h-4 w-4 text-secondary" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search conversations"
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-secondary"
            />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="space-y-4 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-11 w-11 animate-pulse rounded-full bg-border-default" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-2/3 animate-pulse rounded-2xl bg-border-default" />
                    <div className="h-3 w-full animate-pulse rounded-2xl bg-border-default" />
                    <div className="h-3 w-3/4 animate-pulse rounded-2xl bg-border-default" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <MessageSquare className="mb-3 h-10 w-10 text-border-default" />
              <p className="text-sm font-medium text-secondary">No conversations yet</p>
              <p className="mt-1 text-sm text-secondary">Start one from a listing page.</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const active = conversation.id === selectedConversationId
              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => void openConversation(conversation.id)}
                  className={`flex w-full items-start gap-3 border-b border-border-default px-4 py-4 text-left transition hover:bg-surface-hover ${
                    active ? 'bg-surface-hover' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <Avatar name={conversation.otherUser.name} image={conversation.otherUser.profileImage} />
                    {conversation.productImage ? (
                      <span className="absolute -right-1 -bottom-1 overflow-hidden rounded-lg border border-surface shadow-sm">
                        <Image
                          src={conversation.productImage}
                          alt={conversation.productTitle}
                          width={24}
                          height={24}
                          className="h-6 w-6 object-cover"
                        />
                      </span>
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-primary">
                        {conversation.otherUser.name}
                      </p>
                      <span className="shrink-0 text-xs text-secondary">
                        {formatAgo(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-secondary">{conversation.productTitle}</p>
                    <p className="mt-1 truncate text-sm text-secondary">
                      {conversation.lastMessage ? conversation.lastMessage.content : 'No messages yet'}
                    </p>
                  </div>
                  {!conversation.lastMessage?.isMine ? (
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-rose-500" />
                  ) : null}
                </button>
              )
            })
          )}
        </div>
      </aside>

      <main className={`min-h-0 flex-col overflow-hidden bg-surface ${showThreadOnly ? 'flex' : 'hidden lg:flex'}`}>
        {!activeConversationSummary ? (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <div>
              <MessageSquare className="mx-auto mb-3 h-10 w-10 text-border-default" />
              <h1 className="text-lg font-semibold text-primary">
                {activeId ? 'Conversation not found' : 'Select a conversation'}
              </h1>
              <p className="mt-1 text-sm text-secondary">
                Open a thread to view the live chat and reply.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="sticky top-0 z-10 shrink-0 border-b border-border-default bg-surface p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  name={activeConversationSummary.otherUser.name}
                  image={activeConversationSummary.otherUser.profileImage}
                />
                <div className="min-w-0 flex-1">
                  <h1 className="truncate text-base font-semibold text-primary">
                    {activeConversationSummary.otherUser.name}
                  </h1>
                  <p className="truncate text-sm text-secondary">
                    {activeConversationSummary.otherUser.collegeName ?? 'Marketplace conversation'}
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-border-default bg-surface-hover p-3">
                <div className="flex items-center gap-3">
                  {activeConversationSummary.productImage ? (
                    <Image
                      src={activeConversationSummary.productImage}
                      alt={activeConversationSummary.productTitle}
                      width={72}
                      height={72}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-border-default" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-primary">
                      {activeConversationSummary.productTitle}
                    </p>
                    <p className="mt-1 text-sm text-secondary">
                      {activeConversationSummary.isSold ? 'Sold' : 'Active listing'}
                    </p>
                    <Link
                      href={`/listings/${activeConversationSummary.productId}`}
                      className="mt-2 inline-flex text-sm font-semibold text-primary underline underline-offset-4"
                    >
                      View listing
                    </Link>
                  </div>
                </div>
              </div>
              <div className={`mt-3 rounded-2xl border px-3 py-2 text-sm ${limitBannerClass}`}>
                {isMessageLimitReached ? (
                  <span>Message limit reached for this listing discussion</span>
                ) : (
                  <span>
                    {remainingMessages} message{remainingMessages === 1 ? '' : 's'} remaining of {maxAllowedMessages}
                  </span>
                )}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-background p-4">
              {loadingThread ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      <div className="h-16 w-[70%] animate-pulse rounded-3xl bg-border-default" />
                    </div>
                  ))}
                </div>
              ) : activeConversationSummary.messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center">
                  <div>
                    <MessageSquare className="mx-auto mb-3 h-10 w-10 text-border-default" />
                    <p className="text-sm font-medium text-secondary">No messages yet</p>
                    <p className="mt-1 text-sm text-secondary">Send the first message below.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeConversationSummary.messages.map((item) => (
                    <MessageBubble key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-border-default p-4">
              <div className="flex items-end gap-3">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Write a message"
                  rows={1}
                  disabled={isMessageLimitReached}
                  className="min-h-[50px] flex-1 resize-none rounded-2xl border border-border-default bg-surface-hover px-4 py-3 text-sm outline-none transition focus:border-border-default focus:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !message.trim() || isMessageLimitReached}
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-surface-hover disabled:text-secondary"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Send
                </button>
              </div>
              {isMessageLimitReached ? (
                <p className="mt-2 text-sm font-medium text-red-600">
                  Message limit reached for this listing discussion
                </p>
              ) : null}
            </div>
          </>
        )}
      </main>
      </div>
      {error ? (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-4 py-2 text-sm text-background shadow-lg">
          {error}
        </div>
      ) : null}
    </div>
  )
}

function MessageBubble({ item }: { item: ChatMessage }) {
  const mine = item.isMine
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
          mine ? 'rounded-br-md bg-primary text-background' : 'rounded-bl-md bg-surface text-primary'
        }`}
      >
        <p>{item.content}</p>
        <div className={`mt-2 text-xs ${mine ? 'text-background/70' : 'text-secondary'}`}>
          {formatTime(item.createdAt)}
        </div>
      </div>
    </div>
  )
}
