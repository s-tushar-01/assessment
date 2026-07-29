import { Router } from 'express'
import type { RegistrationInput } from './auth.service.js'

type RegisterHandler = (input: RegistrationInput) => Promise<unknown>

export function createAuthRouter(registerUser: RegisterHandler) {
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

  return router
}
