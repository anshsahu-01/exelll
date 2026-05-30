import { MessagesClient } from '@/components/messages/MessagesClient'
import { PageBackButton } from '@/components/ui/PageBackButton'

export const dynamic = 'force-dynamic'

export default function MessageThreadPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <div className="px-4 pt-4 sm:px-6 lg:px-8">
        <PageBackButton href="/messages" label="Messages" />
      </div>
      <MessagesClient activeId={params.id} />
    </div>
  )
}
