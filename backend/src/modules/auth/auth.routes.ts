import { Router } from 'express'
import type { LoginInput, RegistrationInput } from './auth.service.js'

export type RegisterHandler = (input: RegistrationInput) => Promise<unknown>
export type LoginHandler = (input: LoginInput) => Promise<unknown>

export function createAuthRouter(
  registerUser: RegisterHandler,
  loginUser?: LoginHandler,
) {
  const router = Router()

  router.post('/register', async (request, response, next) => {
    try {
      const user = await registerUser(request.body as RegistrationInput)
      return response.status(201).json(user)
    } catch (error) {
      if (error instanceof Error && error.message === 'EMAIL_ALREADY_EXISTS') {
        return response.status(409).json({
          message: 'Email is already registered',
        })
      }

      return next(error)
    }
  })

  if (loginUser) {
    router.post('/login', async (request, response, next) => {
      try {
        const result = await loginUser(request.body as LoginInput)
        return response.status(200).json(result)
      } catch (error) {
        if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
          return response.status(401).json({ message: 'Invalid credentials' })
        }

        return next(error)
      }
    })
  }

  return router
}
