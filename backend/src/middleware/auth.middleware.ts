import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export type AuthenticatedUser = {
  id: string
  role: 'USER' | 'ADMIN'
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser
    }
  }
}

export function requireAuth(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authorization = request.header('authorization')

  if (!authorization?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Authentication required' })
  }

  try {
    const payload = jwt.verify(
      authorization.slice('Bearer '.length),
      process.env.JWT_SECRET ?? 'development-secret',
    )

    if (
      typeof payload === 'string' ||
      typeof payload.sub !== 'string' ||
      (payload.role !== 'USER' && payload.role !== 'ADMIN')
    ) {
      throw new Error('INVALID_TOKEN')
    }

    request.user = {
      id: payload.sub,
      role: payload.role,
    }

    return next()
  } catch {
    return response.status(401).json({ message: 'Authentication required' })
  }
}
