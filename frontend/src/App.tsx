import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

type Vehicle = {
  id: string
  make: string
  model: string
  category: string
  price: number
  quantity: number
}

async function readResponseBody(response: Response): Promise<Record<string, unknown>> {
  try {
    const body: unknown = await response.json()
    return body && typeof body === 'object' ? body as Record<string, unknown> : {}
  } catch {
    return {}
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem('dealership_token')),
  )
  const [role, setRole] = useState(
    () => localStorage.getItem('dealership_role') ?? 'USER',
  )
  const [userEmail, setUserEmail] = useState(
    () => localStorage.getItem('dealership_email') ?? '',
  )
  const isAdmin = role === 'ADMIN'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false)
  const [makeFilter, setMakeFilter] = useState('')
  const [modelFilter, setModelFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [minPriceFilter, setMinPriceFilter] = useState('')
  const [maxPriceFilter, setMaxPriceFilter] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return

    async function loadVehicles() {
      setIsLoadingVehicles(true)
      try {
        const response = await fetch(`${API_URL}/api/vehicles`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('dealership_token') ?? ''}`,
          },
        })
        if (!response.ok) throw new Error('Unable to load vehicles')
        setVehicles(await response.json())
      } catch (vehicleError) {
        setError(vehicleError instanceof Error ? vehicleError.message : 'Unable to load vehicles')
      } finally {
        setIsLoadingVehicles(false)
      }
    }

    void loadVehicles()
  }, [isAuthenticated])

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error ?? 'Unable to sign in')
      }

      localStorage.setItem('dealership_token', result.token)
      localStorage.setItem('dealership_role', result.user.role)
      localStorage.setItem('dealership_email', result.user.email)
      setRole(result.user.role)
      setUserEmail(result.user.email)
      setIsAuthenticated(true)
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('dealership_token')
    localStorage.removeItem('dealership_role')
    localStorage.removeItem('dealership_email')
    setIsAuthenticated(false)
    setVehicles([])
    setRole('USER')
    setUserEmail('')
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const result = await readResponseBody(response)
      if (!response.ok) {
        throw new Error(
          typeof result.message === 'string' ? result.message : 'Unable to register',
        )
      }
      setIsRegistering(false)
      setPassword('')
      setConfirmPassword('')
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : 'Unable to register')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePurchase(vehicleId: string) {
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/vehicles/${vehicleId}/purchase`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('dealership_token') ?? ''}`,
        },
      })
      const updatedVehicle = await response.json()
      if (!response.ok) throw new Error(updatedVehicle.error ?? 'Unable to purchase vehicle')
      setVehicles((currentVehicles) =>
        currentVehicles.map((vehicle) =>
          vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle,
        ),
      )
    } catch (purchaseError) {
      setError(
        purchaseError instanceof Error ? purchaseError.message : 'Unable to purchase vehicle',
      )
    }
  }

  async function handleDelete(vehicleId: string) {
    if (!window.confirm('Delete this vehicle from inventory?')) return
    const response = await fetch(`${API_URL}/api/vehicles/${vehicleId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('dealership_token') ?? ''}` },
    })
    if (response.ok) {
      setVehicles((current) => current.filter((vehicle) => vehicle.id !== vehicleId))
    }
  }

  async function handleRestock(vehicleId: string) {
    const requestedQuantity = window.prompt('How many vehicles should be added?', '1')
    const quantity = Number(requestedQuantity)
    if (!Number.isInteger(quantity) || quantity <= 0) return
    const response = await fetch(`${API_URL}/api/vehicles/${vehicleId}/restock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('dealership_token') ?? ''}`,
      },
      body: JSON.stringify({ quantity }),
    })
    if (response.ok) {
      const updatedVehicle = await response.json()
      setVehicles((current) => current.map((vehicle) =>
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle,
      ))
    }
  }

  async function handleAddVehicle() {
    const make = window.prompt('Make')
    const model = window.prompt('Model')
    const category = window.prompt('Category')
    const price = Number(window.prompt('Price'))
    const quantity = Number(window.prompt('Quantity'))
    if (!make || !model || !category || !Number.isFinite(price) || !Number.isInteger(quantity)) return
    const response = await fetch(`${API_URL}/api/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('dealership_token') ?? ''}`,
      },
      body: JSON.stringify({ make, model, category, price, quantity }),
    })
    if (response.ok) {
      const addedVehicle = await response.json()
      setVehicles((current) => [addedVehicle, ...current])
    }
  }

  async function handleEditVehicle(vehicle: Vehicle) {
    const price = Number(window.prompt('Price', String(vehicle.price)))
    const quantity = Number(window.prompt('Quantity', String(vehicle.quantity)))
    if (!Number.isFinite(price) || !Number.isInteger(quantity)) return
    const response = await fetch(`${API_URL}/api/vehicles/${vehicle.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('dealership_token') ?? ''}`,
      },
      body: JSON.stringify({ price, quantity }),
    })
    if (response.ok) {
      const updatedVehicle = await response.json()
      setVehicles((current) => current.map((item) => item.id === updatedVehicle.id ? updatedVehicle : item))
    }
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoadingVehicles(true)
    setError('')
    const params = new URLSearchParams()
    if (makeFilter) params.set('make', makeFilter)
    if (modelFilter) params.set('model', modelFilter)
    if (categoryFilter) params.set('category', categoryFilter)
    if (minPriceFilter) params.set('minPrice', minPriceFilter)
    if (maxPriceFilter) params.set('maxPrice', maxPriceFilter)

    try {
      const response = await fetch(`${API_URL}/api/vehicles/search?${params}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('dealership_token') ?? ''}`,
        },
      })
      if (!response.ok) throw new Error('Unable to search vehicles')
      setVehicles(await response.json())
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : 'Unable to search vehicles')
    } finally {
      setIsLoadingVehicles(false)
    }
  }

  if (isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
        <section className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Dealership inventory
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Inventory dashboard</h1>
          <p className="mt-3 text-slate-400">Manage and purchase available vehicles.</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-400/50 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">Role: {role}</span>
            {isAdmin && <span className="rounded-full border border-violet-400/50 bg-violet-400/10 px-3 py-1 text-sm text-violet-200">Admin dashboard</span>}
            {userEmail && <span className="text-sm text-slate-400">{userEmail}</span>}
            <button className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400" onClick={handleLogout} type="button">
              Log out
            </button>
          </div>
          {isAdmin && (
            <button className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950" onClick={() => void handleAddVehicle()} type="button">
              Add vehicle
            </button>
          )}
          {error && <p className="mt-6 text-sm text-rose-300" role="alert">{error}</p>}
          {isLoadingVehicles && <p className="mt-8 text-slate-400">Loading vehicles…</p>}
          <form className="mt-8 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:grid-cols-2 lg:grid-cols-3" onSubmit={handleSearch}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="make-filter">Make</label>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                id="make-filter"
                value={makeFilter}
                onChange={(event) => setMakeFilter(event.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="model-filter">Model</label>
              <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400" id="model-filter" value={modelFilter} onChange={(event) => setModelFilter(event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="category-filter">Category</label>
              <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400" id="category-filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="min-price-filter">Minimum price</label>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                id="min-price-filter"
                min="0"
                type="number"
                value={minPriceFilter}
                onChange={(event) => setMinPriceFilter(event.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="max-price-filter">Maximum price</label>
              <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400" id="max-price-filter" min="0" type="number" value={maxPriceFilter} onChange={(event) => setMaxPriceFilter(event.target.value)} />
            </div>
            <button className="rounded-xl bg-white px-5 py-3 font-semibold text-slate-950" type="submit">Search</button>
          </form>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5" key={vehicle.id}>
                <p className="text-sm text-cyan-300">{vehicle.category}</p>
                <h2 className="mt-2 text-xl font-semibold">{vehicle.make} {vehicle.model}</h2>
                <p className="mt-4 text-lg font-medium">${vehicle.price.toLocaleString()}</p>
                <p className="mt-1 text-sm text-slate-400">{vehicle.quantity} in stock</p>
                <button
                  className="mt-5 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                  disabled={vehicle.quantity === 0}
                  onClick={() => void handlePurchase(vehicle.id)}
                  type="button"
                >
                  Purchase
                </button>
                {isAdmin && (
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 rounded-xl border border-white px-3 py-2 text-sm text-white" onClick={() => void handleEditVehicle(vehicle)} type="button">
                      Edit inventory
                    </button>
                    <button className="flex-1 rounded-xl border border-cyan-400 px-3 py-2 text-sm text-cyan-300" onClick={() => void handleRestock(vehicle.id)} type="button">
                      Restock
                    </button>
                    <button className="flex-1 rounded-xl border border-rose-400 px-3 py-2 text-sm text-rose-300" onClick={() => void handleDelete(vehicle.id)} type="button">
                      Delete
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
          {!isLoadingVehicles && vehicles.length === 0 && (
            <p className="mt-10 rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">No vehicles found.</p>
          )}
        </section>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-cyan-950/30">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Dealership inventory
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          {isRegistering ? 'Create account' : 'Sign in'}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Access the vehicle inventory dashboard.
        </p>
        <form className="mt-8 space-y-5" onSubmit={isRegistering ? handleRegister : handleLogin}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="email">
              Email
            </label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="password">
              Password
            </label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {isRegistering && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="confirm-password">
                Confirm password
              </label>
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
          )}
          {error && <p className="text-sm text-rose-300" role="alert">{error}</p>}
          <button
            className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Working…' : isRegistering ? 'Register' : 'Sign in'}
          </button>
          <button
            className="w-full text-sm text-cyan-300 hover:text-cyan-200"
            onClick={() => {
              setIsRegistering((current) => !current)
            }}
            type="button"
          >
            {isRegistering ? 'Back to sign in' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default App
