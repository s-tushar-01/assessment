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
export type DeleteVehicleHandler = (id: string) => Promise<void>
export type PurchaseVehicleHandler = (id: string) => Promise<VehicleRecord>
export type RestockVehicleHandler = (
  id: string,
  quantity: number,
) => Promise<VehicleRecord>

export function createVehicleRouter(
  createVehicle: CreateVehicleHandler,
  authMiddleware?: RequestHandler,
  listVehicles?: ListVehiclesHandler,
  searchVehicles?: SearchVehiclesHandler,
  updateVehicle?: UpdateVehicleHandler,
  deleteVehicle?: DeleteVehicleHandler,
  adminMiddleware?: RequestHandler,
  purchaseVehicle?: PurchaseVehicleHandler,
  restockVehicle?: RestockVehicleHandler,
) {
  const router = Router()

  const handlers = authMiddleware ? [authMiddleware] : []
  const adminHandlers =
    authMiddleware && adminMiddleware
      ? [authMiddleware, adminMiddleware]
      : handlers

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

  if (purchaseVehicle) {
    router.post('/:id/purchase', ...handlers, async (request, response, next) => {
      try {
        const vehicle = await purchaseVehicle(request.params.id as string)
        return response.status(200).json(vehicle)
      } catch (error) {
        return next(error)
      }
    })
  }

  if (restockVehicle) {
    router.post(
      '/:id/restock',
      ...adminHandlers,
      async (request, response, next) => {
        try {
          const vehicle = await restockVehicle(
            request.params.id as string,
            Number(request.body.quantity),
          )
          return response.status(200).json(vehicle)
        } catch (error) {
          return next(error)
        }
      },
    )
  }

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

  if (deleteVehicle) {
    router.delete('/:id', ...adminHandlers, async (request, response, next) => {
      try {
        await deleteVehicle(request.params.id as string)
        return response.status(204).send()
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
