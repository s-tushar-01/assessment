import 'dotenv/config'
import { createApp } from './app.js'
import { createRegisterHandler } from './modules/auth/auth.handler.js'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const registerUser = createRegisterHandler({
  repository: {
    findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
    create: (user) => prisma.user.create({ data: user }),
  },
  hashPassword: (password) => bcrypt.hash(password, 12),
})

const app = createApp({ registerUser })

const port = Number(process.env.PORT ?? 3000)

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`)
})
