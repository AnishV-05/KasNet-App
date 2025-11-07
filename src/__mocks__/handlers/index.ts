import { rest } from 'msw'

import { NEXT_PUBLIC_API_EXTERNAL_URL, ENV } from '@/config/envs'

const sharedTestHandlers = [...(ENV === 'TEST' ? [rest.get('/*.svg', (_, res, ctx) => res(ctx.status(200)))] : [])]

export const handlers = [
  rest.post(`${NEXT_PUBLIC_API_EXTERNAL_URL}/auth`, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        app: 'internal',
        country: 'PE',
        password: 'Secret6!',
        recaptcha_token: 'abc',
        user_name: 'user',
      })
    )
  ),
  ...sharedTestHandlers,
]
