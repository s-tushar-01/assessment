import 'dotenv/config'
import { createApp } from './app.js'
import { createRegisterHandler } from './modules/auth/auth.handler.js'
import { loginUser } from './modules/auth/auth.service.js'
import {
  createVehicle,
  listVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from './modules/vehicles/vehicle.service.js'
import { requireAdmin, requireAuth } from './middleware/auth.middleware.js'
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
          orderBy: { createdAt: 'desc' },
        })

        return vehicles.map((vehicle) => ({
          ...vehicle,
          price: vehicle.price.toNumber(),
        }))
      },
    },
  })

const findVehicles = (
  filters: Parameters<typeof searchVehicles>[0],
) =>
  searchVehicles(filters, {
    repository: {
      search: async (searchFilters) => {
        const where: Prisma.VehicleWhereInput = {}

        if (searchFilters.make) {
          where.make = { contains: searchFilters.make, mode: 'insensitive' }
        }
        if (searchFilters.model) {
          where.model = { contains: searchFilters.model, mode: 'insensitive' }
        }
        if (searchFilters.category) {
          where.category = {
            contains: searchFilters.category,
            mode: 'insensitive',
          }
        }
        if (searchFilters.minPrice !== undefined || searchFilters.maxPrice !== undefined) {
          where.price = {
            gte:
              searchFilters.minPrice === undefined
                ? undefined
                : new Prisma.Decimal(searchFilters.minPrice),
            lte:
              searchFilters.maxPrice === undefined
                ? undefined
                : new Prisma.Decimal(searchFilters.maxPrice),
          }
        }

        const vehicles = await prisma.vehicle.findMany({ where })
        return vehicles.map((vehicle) => ({
          ...vehicle,
          price: vehicle.price.toNumber(),
        }))
      },
    },
  })

const editVehicle = (
  id: string,
  input: Parameters<typeof updateVehicle>[1],
) =>
  updateVehicle(id, input, {
    repository: {
      update: async (vehicleId, changes) => {
        const updated = await prisma.vehicle.update({
          where: { id: vehicleId },
          data: {
            ...changes,
            price:
              changes.price === undefined
                ? undefined
                : new Prisma.Decimal(changes.price),
          },
        })

        return {
          ...updated,
          price: updated.price.toNumber(),
        }
      },
    },
  })

const removeVehicle = (id: string) =>
  deleteVehicle(id, {
    repository: {
      delete: async (vehicleId) => {
        await prisma.vehicle.delete({ where: { id: vehicleId } })
      },
    },
  })

const buyVehicle = (id: string) =>
  purchaseVehicle(id, {
    repository: {
      purchase: async (vehicleId) => {
        const result = await prisma.vehicle.updateMany({
          where: { id: vehicleId, quantity: { gt: 0 } },
          data: { quantity: { decrement: 1 } },
        })

        if (result.count === 0) return null

        const updated = await prisma.vehicle.findUnique({
          where: { id: vehicleId },
        })

        return updated
          ? { ...updated, price: updated.price.toNumber() }
          : null
      },
    },
  })

const addVehicleStock = (id: string, quantity: number) =>
  restockVehicle(id, quantity, {
    repository: {
      restock: async (vehicleId, amount) => {
        const updated = await prisma.vehicle.update({
          where: { id: vehicleId },
          data: { quantity: { increment: amount } },
        })

        return { ...updated, price: updated.price.toNumber() }
      },
    },
  })

const app = createApp({
  registerUser,
  loginUser: login,
  createVehicle: addVehicle,
  vehicleAuth: requireAuth,
  listVehicles: getVehicles,
  searchVehicles: findVehicles,
  updateVehicle: editVehicle,
  deleteVehicle: removeVehicle,
  adminAuth: requireAdmin,
  purchaseVehicle: buyVehicle,
  restockVehicle: addVehicleStock,
})

const port = Number(process.env.PORT ?? 3000)

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`)
})
