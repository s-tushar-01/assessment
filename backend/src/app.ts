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
} from './modules/vehicles/vehicle.routes.js'
import type { RequestHandler } from 'express'

export function createApp(dependencies: {
  registerUser: RegisterHandler
  loginUser?: LoginHandler
  createVehicle?: CreateVehicleHandler
  vehicleAuth?: RequestHandler
  listVehicles?: ListVehiclesHandler
  searchVehicles?: SearchVehiclesHandler
}) {
  const app = express()

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
      ),
    )
  }

  return app
}

export const app = express()
app.use(express.json())
