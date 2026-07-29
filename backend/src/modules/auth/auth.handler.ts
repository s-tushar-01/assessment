import {
  registerUser,
  type RegisterDependencies,
  type RegistrationInput,
} from './auth.service.js'

export function createRegisterHandler(dependencies: RegisterDependencies) {
  return (input: RegistrationInput) => registerUser(input, dependencies)
}
