import { MessagesClient } from '@/components/messages/MessagesClient'
import { PageBackButton } from '@/components/ui/PageBackButton'

export const dynamic = 'force-dynamic'

export default async function MessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div>
      <MessagesClient activeId={id} />
    </div>
  )
}
