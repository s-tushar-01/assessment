import express from 'express'
import {
  createAuthRouter,
  type LoginHandler,
  type RegisterHandler,
} from './modules/auth/auth.routes.js'

export function createApp(dependencies: {
  registerUser: RegisterHandler
  loginUser?: LoginHandler
}) {
  const app = express()

  app.use(express.json())
  app.use(
    '/api/auth',
    createAuthRouter(dependencies.registerUser, dependencies.loginUser),
  )

  return app
}

export const app = express()
app.use(express.json())
