import { IncomingHttpHeaders } from 'http'
import { NextResponse, type NextRequest } from 'next/server'
import { Webhook, WebhookRequiredHeaders } from 'svix'
import { buffer } from 'node:stream/consumers'
import type { UserJSON } from '@clerk/nextjs/server'
import db from '@/app/lib/db'

// NOTE(Sam): all webhooks are dynamic
export const dynamic = 'force-dynamic'

const webhookSecret: string = process.env.CLERK_WEBHOOK_USER_SECRET!

type Event = {
  data: UserJSON
  object: 'event'
  type: EventType
}

// https://clerk.com/docs/integration/webhooks
type EventType = 'user.created'

type NextRequestWithSvixRequiredHeaders = NextRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders
}

export async function POST(request: NextRequestWithSvixRequiredHeaders) {
  // See https://docs.svix.com/receiving/verifying-payloads/how
  // const body = request.body;

  // https://github.com/vercel/next.js/issues/49739#issuecomment-1553858264
  // @ts-expect-error NOTE(Sam): This is a workaround for the issue above
  const payload = await buffer(request.body)
  const headers = request.headers

  const svixHeaders: WebhookRequiredHeaders = {
    'svix-id': headers.get('svix-id')!,
    'svix-signature': headers.get('svix-signature')!,
    'svix-timestamp': headers.get('svix-timestamp')!,
  }

  const webhook = new Webhook(webhookSecret)

  let event: Event | null = null

  try {
    event = webhook.verify(payload, svixHeaders) as Event
  } catch (e: unknown) {
    console.error(e)
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    )
  }

  const eventType: EventType = event.type

  if (eventType === 'user.created') {
    const user = event.data

    if (
      !user.email_addresses ||
      user.email_addresses.length === 0 ||
      !user.email_addresses[0]
    ) {
      return NextResponse.json({
        success: false,
        error: 'Email address not found',
        status: 400,
      })
    }

    try {
      await db.user.create({
        data: {
          id: user.id,
          name: [user.first_name, user.last_name].join(' ') || user.id,
          email: user.email_addresses[0].email_address,
        },
      })
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({
          success: false,
          message: 'Failed to create user',
          error: error.message,
          status: 500,
        })
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to create user',
          error: 'Unknown error',
          status: 500,
        })
      }
    }
  }

  return NextResponse.json({ status: 201, message: 'db user created' })
}
