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
  const totalStock = vehicles.reduce((total, vehicle) => total + vehicle.quantity, 0)
  const categoryCount = new Set(vehicles.map((vehicle) => vehicle.category)).size
  const lowStockCount = vehicles.filter((vehicle) => vehicle.quantity > 0 && vehicle.quantity < 3).length

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
      <main className="dashboard-shell px-4 py-8 text-slate-100 sm:px-6 sm:py-12">
        <section className="dashboard-content">
          <header className="dashboard-header">
            <div>
              <p className="brand-eyebrow">Dealership inventory</p>
              <h1>Inventory dashboard</h1>
              <p>Manage and purchase available vehicles.</p>
            </div>
            <div className="dashboard-actions">
              <span className="status-pill">Role: {role}</span>
              {isAdmin && <span className="status-pill admin">Admin dashboard</span>}
              {userEmail && <span className="text-sm text-slate-400">{userEmail}</span>}
              <button className="dashboard-logout" onClick={handleLogout} type="button">Log out</button>
            </div>
          </header>
          <div className="metrics-grid">
            <div className="metric-card"><span className="metric-label">Visible vehicles</span><strong className="metric-value">{vehicles.length}</strong></div>
            <div className="metric-card"><span className="metric-label">Units in stock</span><strong className="metric-value">{totalStock}</strong></div>
            <div className="metric-card"><span className="metric-label">Categories / low stock</span><strong className="metric-value">{categoryCount} / {lowStockCount}</strong></div>
          </div>
          {isAdmin && (
            <div className="admin-card mt-6">
              <p className="admin-card-title">Admin tools</p>
              <button className="admin-card-action" onClick={() => void handleAddVehicle()} type="button">
                + Add vehicle
              </button>
            </div>
          )}
          {error && <p className="error-message" role="alert">{error}</p>}
          {isLoadingVehicles && <p className="mt-8 text-slate-400" aria-live="polite">Loading vehicles...</p>}
          <form className="search-panel mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" onSubmit={handleSearch}>
            <div className="search-panel-header col-span-full"><div><h2>Find your next vehicle</h2><p>Filter by make, model, category, or price.</p></div></div>
            <div className="dashboard-field">
              <label htmlFor="make-filter">Make</label>
              <input
                className=""
                id="make-filter"
                value={makeFilter}
                onChange={(event) => setMakeFilter(event.target.value)}
              />
            </div>
            <div className="dashboard-field">
              <label htmlFor="model-filter">Model</label>
              <input id="model-filter" value={modelFilter} onChange={(event) => setModelFilter(event.target.value)} />
            </div>
            <div className="dashboard-field">
              <label htmlFor="category-filter">Category</label>
              <input id="category-filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} />
            </div>
            <div className="dashboard-field">
              <label htmlFor="min-price-filter">Minimum price</label>
              <input
                className=""
                id="min-price-filter"
                min="0"
                type="number"
                value={minPriceFilter}
                onChange={(event) => setMinPriceFilter(event.target.value)}
              />
            </div>
            <div className="dashboard-field">
              <label htmlFor="max-price-filter">Maximum price</label>
              <input id="max-price-filter" min="0" type="number" value={maxPriceFilter} onChange={(event) => setMaxPriceFilter(event.target.value)} />
            </div>
            <button className="search-button" type="submit">Search inventory</button>
          </form>
          <div className="vehicle-grid mt-8">
            {vehicles.map((vehicle) => (
              <article className="vehicle-card" key={vehicle.id}>
                <p className="vehicle-category">{vehicle.category}</p>
                <h2>{vehicle.make} {vehicle.model}</h2>
                <p className="vehicle-price">${vehicle.price.toLocaleString()}</p>
                <p className="vehicle-stock">{vehicle.quantity} in stock</p>
                <button
                  className="purchase-button mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={vehicle.quantity === 0}
                  onClick={() => void handlePurchase(vehicle.id)}
                  type="button"
                >
                  Purchase
                </button>
                {isAdmin && (
                  <div className="admin-actions">
                    <button onClick={() => void handleEditVehicle(vehicle)} type="button">
                      Edit inventory
                    </button>
                    <button onClick={() => void handleRestock(vehicle.id)} type="button">
                      Restock
                    </button>
                    <button onClick={() => void handleDelete(vehicle.id)} type="button">
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
    <main className="auth-page flex items-center justify-center px-6 py-12 text-slate-100">
      <div className="auth-layout">
        <section className="auth-intro hidden md:block">
          <p className="auth-eyebrow">Dealership inventory</p>
          <h2>Move inventory<br />with confidence.</h2>
          <p>A focused workspace for teams managing vehicle stock, purchases, and dealership operations.</p>
          <div className="auth-proof"><span>Live stock visibility</span><span>Role-aware access</span><span>Fast purchasing</span></div>
        </section>
        <section className="auth-form">
        <p className="brand-eyebrow">Dealership inventory</p>
        <h1 className="auth-heading font-bold tracking-tight">
          {isRegistering ? 'Create account' : 'Sign in'}
        </h1>
        <p className="auth-subtitle">
          Access the vehicle inventory dashboard.
        </p>
        <form className="mt-6 space-y-5" onSubmit={isRegistering ? handleRegister : handleLogin}>
          <div className="cool-field">
            <label className="cool-label" htmlFor="email">
              Email
            </label>
            <input
              className="cool-input"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="cool-field">
            <label className="cool-label" htmlFor="password">
              Password
            </label>
            <input
              className="cool-input"
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
            <div className="cool-field">
              <label className="cool-label" htmlFor="confirm-password">
                Confirm password
              </label>
              <input
                className="cool-input"
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
            className="auth-button w-full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Working...' : isRegistering ? 'Register' : 'Sign in'}
          </button>
          <button
            className="auth-switch w-full"
            onClick={() => {
              setIsRegistering((current) => !current)
            }}
            type="button"
          >
            {isRegistering ? 'Back to sign in' : 'Create account'}
          </button>
        </form>
        </section>
      </div>
    </main>
  )
}

export default App
