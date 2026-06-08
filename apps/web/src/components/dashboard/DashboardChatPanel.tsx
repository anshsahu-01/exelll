import Image from 'next/image';
import Link from 'next/link';
import { ConversationListItem } from '@/types';
import { MessageSquare, Users } from 'lucide-react';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DashboardChatPanel({
  conversations,
}: {
  conversations: ConversationListItem[];
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border-default">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-secondary">Messages</h2>
          <Link
            href="/messages"
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            View all
          </Link>
        </div>
      </div>

      {conversations.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center flex-1 px-6 py-10 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-hover flex items-center justify-center mb-3">
            <MessageSquare className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-sm font-medium text-secondary mb-1">No conversations yet</p>
          <p className="text-xs text-secondary mb-5">
            Browse listings and message sellers to get started.
          </p>

          {/* Connect suggestions */}
          <div className="w-full space-y-2">
            <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Get connected
            </p>
            <Link
              href="/listings"
              className="flex items-center gap-3 p-3 rounded-lg border border-border-default hover:bg-surface-hover transition text-left w-full"
            >
              <span className="text-lg">🛒</span>
              <div>
                <p className="text-sm font-medium text-gray-800">Browse Listings</p>
                <p className="text-xs text-secondary">Find items and contact sellers</p>
              </div>
            </Link>
            <Link
              href="/sell"
              className="flex items-center gap-3 p-3 rounded-lg border border-border-default hover:bg-surface-hover transition text-left w-full"
            >
              <span className="text-lg">📦</span>
              <div>
                <p className="text-sm font-medium text-gray-800">Post a Listing</p>
                <p className="text-xs text-secondary">Sell your items to other students</p>
              </div>
            </Link>
          </div>
        </div>
      ) : (
        /* Real conversation list */
        <ul className="divide-y divide-gray-100 overflow-y-auto flex-1">
          {conversations.map((conv) => (
            <li key={conv.id}>
              <Link
                href={`/messages/${conv.id}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-surface-hover transition"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  {conv.otherUser.profileImage ? (
                    <Image
                      src={conv.otherUser.profileImage}
                      alt={conv.otherUser.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover w-10 h-10"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-secondary">
                      {conv.otherUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-semibold text-primary truncate">
                      {conv.otherUser.name}
                    </p>
                    {conv.lastMessageAt && (
                      <span className="text-xs text-secondary ml-1 shrink-0">
                        {timeAgo(conv.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-secondary truncate mt-0.5">{conv.productTitle}</p>
                  {conv.lastMessage && (
                    <p className="text-xs text-secondary truncate mt-0.5">
                      {conv.lastMessage.isMine ? 'You: ' : ''}
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
