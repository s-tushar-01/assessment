import { Router, type RequestHandler } from 'express'
import type {
  VehicleInput,
  VehicleRecord,
  VehicleSearchFilters,
  VehicleUpdateInput,
} from './vehicle.service.js'

export type CreateVehicleHandler = (
  input: VehicleInput,
) => Promise<VehicleRecord>
export type ListVehiclesHandler = () => Promise<VehicleRecord[]>
export type SearchVehiclesHandler = (
  filters: VehicleSearchFilters,
) => Promise<VehicleRecord[]>
export type UpdateVehicleHandler = (
  id: string,
  input: VehicleUpdateInput,
) => Promise<VehicleRecord>

export function createVehicleRouter(
  createVehicle: CreateVehicleHandler,
  authMiddleware?: RequestHandler,
  listVehicles?: ListVehiclesHandler,
  searchVehicles?: SearchVehiclesHandler,
  updateVehicle?: UpdateVehicleHandler,
) {
  const router = Router()

  const handlers = authMiddleware ? [authMiddleware] : []

  if (searchVehicles) {
    router.get('/search', ...handlers, async (request, response, next) => {
      try {
        const numberQuery = (value: unknown) => {
          if (typeof value !== 'string' || value.length === 0) return undefined
          const number = Number(value)
          return Number.isFinite(number) ? number : undefined
        }

        const filters: VehicleSearchFilters = {
          make: typeof request.query.make === 'string' ? request.query.make : undefined,
          model: typeof request.query.model === 'string' ? request.query.model : undefined,
          category:
            typeof request.query.category === 'string'
              ? request.query.category
              : undefined,
          minPrice: numberQuery(request.query.minPrice),
          maxPrice: numberQuery(request.query.maxPrice),
        }

        const vehicles = await searchVehicles(filters)
        return response.status(200).json(vehicles)
      } catch (error) {
        return next(error)
      }
    })
  }

  router.post('/', ...handlers, async (request, response, next) => {
    try {
      const vehicle = await createVehicle(request.body as VehicleInput)
      return response.status(201).json(vehicle)
    } catch (error) {
      return next(error)
    }
  })

  if (updateVehicle) {
    router.put('/:id', ...handlers, async (request, response, next) => {
      try {
        const vehicle = await updateVehicle(
          request.params.id as string,
          request.body as VehicleUpdateInput,
        )
        return response.status(200).json(vehicle)
      } catch (error) {
        return next(error)
      }
    })
  }

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
