import express from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { requireAuth } from '../../src/middleware/auth.middleware.js'

describe('requireAuth', () => {
  it('rejects requests without a bearer token', async () => {
    const app = express()
    app.get('/protected', requireAuth, (_request, response) => {
      response.json({ ok: true })
    })

    const response = await request(app).get('/protected')

    expect(response.status).toBe(401)
    expect(response.body).toEqual({ message: 'Authentication required' })
  })

  it('attaches the authenticated user from a valid JWT', async () => {
    const app = express()
    app.get('/protected', requireAuth, (request, response) => {
      response.json({ user: request.user })
    })
    const token = jwt.sign(
      { sub: 'user-1', role: 'USER' },
      'development-secret',
    )

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.user).toEqual({ id: 'user-1', role: 'USER' })
  })
})
