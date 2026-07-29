export type RegistrationInput = {
  email: string
  password: string
}

export type NewUser = {
  email: string
  passwordHash: string
  role: 'USER'
}

export type CreatedUser = Omit<NewUser, 'role'> & {
  id: string
  role: 'USER' | 'ADMIN'
}

export type UserRepository = {
  findByEmail: (email: string) => Promise<unknown>
  create: (user: NewUser) => Promise<CreatedUser>
}

export type RegisterDependencies = {
  repository: UserRepository
  hashPassword: (password: string) => Promise<string>
}

export type LoginInput = {
  email: string
  password: string
}

export type StoredUser = {
  id: string
  email: string
  passwordHash: string
  role: 'USER' | 'ADMIN'
}

export type LoginDependencies = {
  repository: {
    findByEmail: (email: string) => Promise<StoredUser | null>
  }
  comparePassword: (password: string, passwordHash: string) => Promise<boolean>
  signToken: (payload: { sub: string; role: 'USER' | 'ADMIN' }) => string
}

export async function registerUser(
  input: RegistrationInput,
  dependencies: RegisterDependencies,
) {
  if (input.password.length < 8) {
    throw new Error('PASSWORD_TOO_SHORT')
  }

  const existingUser = await dependencies.repository.findByEmail(input.email)

  if (existingUser) {
    throw new Error('EMAIL_ALREADY_EXISTS')
  }

  const passwordHash = await dependencies.hashPassword(input.password)

  const createdUser = await dependencies.repository.create({
    email: input.email,
    passwordHash,
    role: 'USER',
  })

  const { passwordHash: _passwordHash, ...publicUser } = createdUser
  return publicUser
}

export async function loginUser(
  input: LoginInput,
  dependencies: LoginDependencies,
) {
  const user = await dependencies.repository.findByEmail(input.email)

  if (!user) {
    throw new Error('INVALID_CREDENTIALS')
  }

  const passwordMatches = await dependencies.comparePassword(
    input.password,
    user.passwordHash,
  )

  if (!passwordMatches) {
    throw new Error('INVALID_CREDENTIALS')
  }

  const token = dependencies.signToken({ sub: user.id, role: user.role })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  }
}
