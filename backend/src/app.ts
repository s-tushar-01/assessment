import express from 'express'
import {
  createAuthRouter,
  type LoginHandler,
  type RegisterHandler,
} from './modules/auth/auth.routes.js'
import {
  createVehicleRouter,
  type CreateVehicleHandler,
  type ListVehiclesHandler,
  type SearchVehiclesHandler,
  type UpdateVehicleHandler,
  type DeleteVehicleHandler,
  type PurchaseVehicleHandler,
  type RestockVehicleHandler,
} from './modules/vehicles/vehicle.routes.js'
import type { RequestHandler } from 'express'

export function createApp(dependencies: {
  registerUser: RegisterHandler
  loginUser?: LoginHandler
  createVehicle?: CreateVehicleHandler
  vehicleAuth?: RequestHandler
  listVehicles?: ListVehiclesHandler
  searchVehicles?: SearchVehiclesHandler
  updateVehicle?: UpdateVehicleHandler
  deleteVehicle?: DeleteVehicleHandler
  adminAuth?: RequestHandler
  purchaseVehicle?: PurchaseVehicleHandler
  restockVehicle?: RestockVehicleHandler
}) {
  const app = express()

  app.use((request, response, next) => {
    const origin = request.headers.origin
    if (origin === 'http://localhost:5173') {
      response.setHeader('Access-Control-Allow-Origin', origin)
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    }
    if (request.method === 'OPTIONS') return response.status(204).send()
    return next()
  })
  app.use(express.json())
  app.use(
    '/api/auth',
    createAuthRouter(dependencies.registerUser, dependencies.loginUser),
  )

  if (dependencies.createVehicle) {
    app.use(
      '/api/vehicles',
      createVehicleRouter(
        dependencies.createVehicle,
        dependencies.vehicleAuth,
        dependencies.listVehicles,
        dependencies.searchVehicles,
        dependencies.updateVehicle,
        dependencies.deleteVehicle,
        dependencies.adminAuth,
        dependencies.purchaseVehicle,
        dependencies.restockVehicle,
      ),
    )
  }

  return app
}

export const app = express()
app.use(express.json())
