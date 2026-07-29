import 'dotenv/config'
import { createApp } from './app.js'
import { createRegisterHandler } from './modules/auth/auth.handler.js'
import { loginUser } from './modules/auth/auth.service.js'
import {
  createVehicle,
  listVehicles,
} from './modules/vehicles/vehicle.service.js'
import { requireAuth } from './middleware/auth.middleware.js'
import { Prisma, PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

const registerUser = createRegisterHandler({
  repository: {
    findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
    create: (user) => prisma.user.create({ data: user }),
  },
  hashPassword: (password) => bcrypt.hash(password, 12),
})

const login = (input: Parameters<typeof loginUser>[0]) =>
  loginUser(input, {
    repository: {
      findByEmail: (email) => prisma.user.findUnique({ where: { email } }),
    },
    comparePassword: (password, passwordHash) =>
      bcrypt.compare(password, passwordHash),
    signToken: (payload) =>
      jwt.sign(payload, process.env.JWT_SECRET ?? 'development-secret'),
  })

const addVehicle = (input: Parameters<typeof createVehicle>[0]) =>
  createVehicle(input, {
    repository: {
      create: async (vehicle) => {
        const created = await prisma.vehicle.create({
          data: {
            ...vehicle,
            price: new Prisma.Decimal(vehicle.price),
          },
        })

        return {
          ...created,
          price: created.price.toNumber(),
        }
      },
    },
  })

const getVehicles = () =>
  listVehicles({
    repository: {
      findMany: async () => {
        const vehicles = await prisma.vehicle.findMany({
          where: { quantity: { gt: 0 } },
          orderBy: { createdAt: 'desc' },
        })

        return vehicles.map((vehicle) => ({
          ...vehicle,
          price: vehicle.price.toNumber(),
        }))
      },
    },
  })

const app = createApp({
  registerUser,
  loginUser: login,
  createVehicle: addVehicle,
  vehicleAuth: requireAuth,
  listVehicles: getVehicles,
})

const port = Number(process.env.PORT ?? 3000)

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`)
})
