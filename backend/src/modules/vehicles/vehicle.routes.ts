import { Router, type RequestHandler } from 'express'
import type {
  VehicleInput,
  VehicleRecord,
} from './vehicle.service.js'

export type CreateVehicleHandler = (
  input: VehicleInput,
) => Promise<VehicleRecord>
export type ListVehiclesHandler = () => Promise<VehicleRecord[]>

export function createVehicleRouter(
  createVehicle: CreateVehicleHandler,
  authMiddleware?: RequestHandler,
  listVehicles?: ListVehiclesHandler,
) {
  const router = Router()

  const handlers = authMiddleware ? [authMiddleware] : []

  router.post('/', ...handlers, async (request, response, next) => {
    try {
      const vehicle = await createVehicle(request.body as VehicleInput)
      return response.status(201).json(vehicle)
    } catch (error) {
      return next(error)
    }
  })

  if (listVehicles) {
    router.get('/', ...handlers, async (_request, response, next) => {
      try {
        const vehicles = await listVehicles()
        return response.status(200).json(vehicles)
      } catch (error) {
        return next(error)
      }
    })
  }

  return router
}
