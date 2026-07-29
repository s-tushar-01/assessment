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

function MetricIcon({ type }: { type: 'vehicle' | 'stock' | 'value' }) {
  if (type === 'value') {
    return <span className="metric-icon" aria-hidden="true">$</span>
  }

  if (type === 'stock') {
    return (
      <span className="metric-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
          <path d="m4.3 7.7 7.7 4.4 7.7-4.4M12 12.1V21" />
        </svg>
      </span>
    )
  }

  return (
    <span className="metric-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m5 16 1.2-5.4A2 2 0 0 1 8.2 9h7.6a2 2 0 0 1 2 1.6L19 16" />
        <path d="M4 15h16v4H4zM7 19v1M17 19v1M7 13h.01M17 13h.01" />
      </svg>
    </span>
  )
}

function VehicleGlyph() {
  return (
    <svg className="vehicle-glyph" viewBox="0 0 260 120" fill="none" aria-hidden="true">
      <path d="M36 76 52 45c3-6 8-9 15-9h93c8 0 13 3 18 10l15 30v11H36V76Z" fill="currentColor" opacity=".16" />
      <path d="M36 76 52 45c3-6 8-9 15-9h93c8 0 13 3 18 10l15 30M36 76v11h157V76M65 87v9m99-9v9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m67 44 12 29h69l13-29M46 77h12m144 0h12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="68" cy="87" r="12" fill="#0f1720" stroke="currentColor" strokeWidth="4" />
      <circle cx="177" cy="87" r="12" fill="#0f1720" stroke="currentColor" strokeWidth="4" />
    </svg>
  )
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
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
  const [isAddingVehicle, setIsAddingVehicle] = useState(false)
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', category: '', price: '', quantity: '' })
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(false)
  const [makeFilter, setMakeFilter] = useState('')
  const [modelFilter, setModelFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [minPriceFilter, setMinPriceFilter] = useState('')
  const [maxPriceFilter, setMaxPriceFilter] = useState('')
  const totalStock = vehicles.reduce((total, vehicle) => total + vehicle.quantity, 0)
  const totalInventoryValue = vehicles.reduce(
    (total, vehicle) => total + vehicle.price * vehicle.quantity,
    0,
  )
  const hasFilters = Boolean(makeFilter || modelFilter || categoryFilter || minPriceFilter || maxPriceFilter)

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

  async function handleAddVehicle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const price = Number(newVehicle.price)
    const quantity = Number(newVehicle.quantity)
    if (!newVehicle.make.trim() || !newVehicle.model.trim() || !newVehicle.category.trim() || !Number.isFinite(price) || price < 0 || !Number.isInteger(quantity) || quantity < 0) {
      setError('Enter a make, model, category, valid price, and whole-number quantity.')
      return
    }

    setError('')
    setIsAddingVehicle(true)
    try {
      const response = await fetch(`${API_URL}/api/vehicles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('dealership_token') ?? ''}`,
        },
        body: JSON.stringify({
          make: newVehicle.make.trim(),
          model: newVehicle.model.trim(),
          category: newVehicle.category.trim(),
          price,
          quantity,
        }),
      })
      const result = await readResponseBody(response)
      if (!response.ok) throw new Error(typeof result.message === 'string' ? result.message : 'Unable to add vehicle')
      setVehicles((current) => [result as unknown as Vehicle, ...current])
      setNewVehicle({ make: '', model: '', category: '', price: '', quantity: '' })
      setIsAddVehicleOpen(false)
    } catch (addVehicleError) {
      setError(addVehicleError instanceof Error ? addVehicleError.message : 'Unable to add vehicle')
    } finally {
      setIsAddingVehicle(false)
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
      <main className="dashboard-shell text-slate-100">
        <section className="dashboard-content">
          <header className="dashboard-topbar">
            <div className="dashboard-brand">
              <h1>Dealership Inventory</h1>
              <h2>Inventory dashboard</h2>
            </div>
            <div className="dashboard-actions">
              {userEmail && <span className="dashboard-email">{userEmail}</span>}
              <span className="status-pill">Role: {role}</span>
              {isAdmin && <span className="status-pill admin">Admin dashboard</span>}
              <button className="dashboard-logout" onClick={handleLogout} type="button">
                <span className="button-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 17 15 12 10 7M15 12H3M21 19V5a2 2 0 0 0-2-2h-6" /></svg></span> Log out
              </button>
            </div>
          </header>
          <div className="metrics-grid">
            <div className="metric-card"><MetricIcon type="vehicle" /><div><span className="metric-label">Total vehicles</span><strong className="metric-value">{vehicles.length}</strong><small>All vehicles in inventory</small></div></div>
            <div className="metric-card"><MetricIcon type="stock" /><div><span className="metric-label">Total in stock</span><strong className="metric-value">{totalStock}</strong><small>Vehicles available</small></div></div>
            <div className="metric-card"><MetricIcon type="value" /><div><span className="metric-label">Total inventory value</span><strong className="metric-value">${totalInventoryValue.toLocaleString()}</strong><small>Retail value</small></div></div>
          </div>
          {isAdmin && (
            <div className="admin-card mt-6">
              <div className="admin-card-copy">
                <span className="admin-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 16.5 5.4 10a2 2 0 0 1 2-1.6h9.2a2 2 0 0 1 2 1.6l1.4 6.5" />
                    <path d="M3.5 15.5h17v4h-17zM7 19.5v1M17 19.5v1M7.5 12.5h.01M16.5 12.5h.01" />
                  </svg>
                </span>
                <div>
                  <p className="admin-card-title">Admin tools</p>
                  <p className="admin-card-description">Add a new vehicle to the dealership inventory.</p>
                </div>
              </div>
              <button className="admin-card-action" onClick={() => setIsAddVehicleOpen(true)} type="button">
                <span className="button-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                Add vehicle
              </button>
            </div>
          )}
          {isAddVehicleOpen && (
            <div className="modal-backdrop" role="presentation">
              <section className="vehicle-modal" role="dialog" aria-modal="true" aria-labelledby="add-vehicle-title">
                <div className="vehicle-modal-header">
                  <div>
                    <p className="modal-eyebrow">Admin inventory</p>
                    <h2 id="add-vehicle-title">Add vehicle</h2>
                    <p>Enter the vehicle details to add it to stock.</p>
                  </div>
                  <button className="modal-close" onClick={() => setIsAddVehicleOpen(false)} type="button" aria-label="Close add vehicle form">×</button>
                </div>
                <form className="vehicle-form" onSubmit={(event) => void handleAddVehicle(event)}>
                  <div className="vehicle-form-grid">
                    <div className="dashboard-field"><label htmlFor="new-vehicle-make">Make</label><input id="new-vehicle-make" required value={newVehicle.make} onChange={(event) => setNewVehicle((current) => ({ ...current, make: event.target.value }))} /></div>
                    <div className="dashboard-field"><label htmlFor="new-vehicle-model">Model</label><input id="new-vehicle-model" required value={newVehicle.model} onChange={(event) => setNewVehicle((current) => ({ ...current, model: event.target.value }))} /></div>
                    <div className="dashboard-field"><label htmlFor="new-vehicle-category">Category</label><input id="new-vehicle-category" required value={newVehicle.category} onChange={(event) => setNewVehicle((current) => ({ ...current, category: event.target.value }))} /></div>
                    <div className="dashboard-field"><label htmlFor="new-vehicle-price">Price</label><input id="new-vehicle-price" min="0" required type="number" value={newVehicle.price} onChange={(event) => setNewVehicle((current) => ({ ...current, price: event.target.value }))} /></div>
                    <div className="dashboard-field"><label htmlFor="new-vehicle-quantity">Quantity</label><input id="new-vehicle-quantity" min="0" required step="1" type="number" value={newVehicle.quantity} onChange={(event) => setNewVehicle((current) => ({ ...current, quantity: event.target.value }))} /></div>
                  </div>
                  <div className="vehicle-form-actions"><button className="modal-cancel" onClick={() => setIsAddVehicleOpen(false)} type="button">Cancel</button><button className="admin-card-action" disabled={isAddingVehicle} type="submit">{isAddingVehicle ? 'Adding vehicle...' : 'Add vehicle'}</button></div>
                </form>
              </section>
            </div>
          )}
          {error && <p className="error-message" role="alert">{error}</p>}
          {isLoadingVehicles && <p className="mt-8 text-slate-400" aria-live="polite">Loading vehicles...</p>}
          <form className="search-panel mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6" onSubmit={handleSearch}>
            <div className="search-panel-header col-span-full">
              <div><p className="search-panel-eyebrow">Inventory filters</p><h2>Search inventory</h2><p className="search-panel-helper">Refine the available stock by vehicle details and price.</p></div>
              {hasFilters && <button className="clear-filters" onClick={() => { setMakeFilter(''); setModelFilter(''); setCategoryFilter(''); setMinPriceFilter(''); setMaxPriceFilter('') }} type="button">Clear filters</button>}
            </div>
            <div className="dashboard-field">
              <label htmlFor="make-filter">Make</label>
              <input
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
            <button className="search-button" type="submit"><span className="button-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg></span> Search</button>
          </form>
          <div className="vehicle-grid mt-8">
            {vehicles.map((vehicle) => (
              <article className="vehicle-card" key={vehicle.id}>
                <div className="vehicle-card-main"><div className="vehicle-art"><VehicleGlyph /></div><div className="vehicle-name"><p className="vehicle-category">{vehicle.category}</p><h2>{vehicle.make} {vehicle.model}</h2></div></div>
                <div className="vehicle-card-footer"><p className="vehicle-price">${vehicle.price.toLocaleString()}</p><p className={`vehicle-stock ${vehicle.quantity === 0 ? 'out-of-stock' : ''}`}>{vehicle.quantity} in stock</p>
                <button
                  className="purchase-button mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={vehicle.quantity === 0}
                  onClick={() => void handlePurchase(vehicle.id)}
                  type="button"
                >
                  Purchase
                </button>
                </div>
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
