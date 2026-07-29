export type RegistrationInput = {
  email: string
  password: string
}

export type NewUser = {
  email: string
  passwordHash: string
  role: 'USER'
}

export type UserRepository = {
  findByEmail: (email: string) => Promise<unknown>
  create: (user: NewUser) => Promise<unknown>
}

export type RegisterDependencies = {
  repository: UserRepository
  hashPassword: (password: string) => Promise<string>
}

export async function registerUser(
  input: RegistrationInput,
  dependencies: RegisterDependencies,
) {
  const existingUser = await dependencies.repository.findByEmail(input.email)

  if (existingUser) {
    throw new Error('EMAIL_ALREADY_EXISTS')
  }

  const passwordHash = await dependencies.hashPassword(input.password)

  return dependencies.repository.create({
    email: input.email,
    passwordHash,
    role: 'USER',
  })
}
