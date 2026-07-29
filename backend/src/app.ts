import express from 'express'
import {
  createAuthRouter,
  type RegisterHandler,
} from './modules/auth/auth.routes.js'

export function createApp(dependencies: { registerUser: RegisterHandler }) {
  const app = express()

  app.use(express.json())
  app.use('/api/auth', createAuthRouter(dependencies.registerUser))

  return app
}

export const app = express()
app.use(express.json())
