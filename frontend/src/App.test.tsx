import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('App', () => {
  it('shows the dealership login form', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeTruthy()
    expect(screen.getByLabelText(/email/i)).toBeTruthy()
    expect(screen.getByLabelText(/password/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /create account/i })).toBeTruthy()
  })

  it('switches to the registration form', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByRole('heading', { name: /create account/i })).toBeTruthy()
    expect(screen.getByLabelText(/confirm password/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /register/i })).toBeTruthy()
  })

  it('logs in and opens the inventory dashboard', async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          token: 'token-1',
          user: { id: 'user-1', email: 'buyer@example.com', role: 'USER' },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    render(<App />)
    await user.type(screen.getByLabelText(/email/i), 'buyer@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /inventory dashboard/i })).toBeTruthy(),
    )
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/login'),
      expect.objectContaining({ method: 'POST' }),
    )
    vi.restoreAllMocks()
  })

  it('loads and displays available vehicles for an authenticated user', async () => {
    localStorage.setItem('dealership_token', 'token-1')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 'vehicle-1',
            make: 'Honda',
            model: 'Civic',
            category: 'Sedan',
            price: 28900,
            quantity: 3,
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    render(<App />)

    await waitFor(() => expect(screen.getByText('Honda Civic')).toBeTruthy())
    expect(screen.getByRole('button', { name: /purchase/i })).toBeTruthy()
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('purchases a vehicle and refreshes its stock', async () => {
    const user = userEvent.setup()
    localStorage.setItem('dealership_token', 'token-1')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            {
              id: 'vehicle-1',
              make: 'Honda',
              model: 'Civic',
              category: 'Sedan',
              price: 28900,
              quantity: 3,
            },
          ]),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: 'vehicle-1',
            make: 'Honda',
            model: 'Civic',
            category: 'Sedan',
            price: 28900,
            quantity: 2,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      )

    render(<App />)
    await waitFor(() => expect(screen.getByText('3 in stock')).toBeTruthy())
    await user.click(screen.getByRole('button', { name: /purchase/i }))

    await waitFor(() => expect(screen.getByText('2 in stock')).toBeTruthy())
    expect(fetchMock).toHaveBeenLastCalledWith(
      expect.stringContaining('/api/vehicles/vehicle-1/purchase'),
      expect.objectContaining({ method: 'POST' }),
    )
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('searches inventory using make and price filters', async () => {
    const user = userEvent.setup()
    localStorage.setItem('dealership_token', 'token-1')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify([]), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            {
              id: 'vehicle-2',
              make: 'Toyota',
              model: 'Corolla',
              category: 'Sedan',
              price: 24000,
              quantity: 2,
            },
          ]),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      )

    render(<App />)
    await user.type(screen.getByLabelText(/make/i), 'Toyota')
    await user.type(screen.getByLabelText(/minimum price/i), '20000')
    await user.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() => expect(screen.getByText('Toyota Corolla')).toBeTruthy())
    expect(fetchMock).toHaveBeenLastCalledWith(
      expect.stringContaining('/api/vehicles/search?'),
      expect.objectContaining({ method: 'GET' }),
    )
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('shows admin inventory controls for an admin user', async () => {
    localStorage.setItem('dealership_token', 'admin-token')
    localStorage.setItem('dealership_role', 'ADMIN')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: 'vehicle-1',
            make: 'Honda',
            model: 'Civic',
            category: 'Sedan',
            price: 28900,
            quantity: 3,
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    render(<App />)

    await waitFor(() => expect(screen.getByText('Honda Civic')).toBeTruthy())
    expect(screen.getByRole('button', { name: /restock/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /delete/i })).toBeTruthy()
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('shows add and edit controls for an admin user', async () => {
    localStorage.setItem('dealership_token', 'admin-token')
    localStorage.setItem('dealership_role', 'ADMIN')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify([
          { id: 'vehicle-1', make: 'Honda', model: 'Civic', category: 'Sedan', price: 28900, quantity: 3 },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    render(<App />)

    await waitFor(() => expect(screen.getByRole('heading', { name: /inventory dashboard/i })).toBeTruthy())
    expect(screen.getByRole('button', { name: /add vehicle/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /edit inventory/i })).toBeTruthy()
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('shows the current role and logs out an authenticated user', async () => {
    const user = userEvent.setup()
    localStorage.setItem('dealership_token', 'user-token')
    localStorage.setItem('dealership_role', 'USER')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    )

    render(<App />)

    expect(screen.getByText(/role: user/i)).toBeTruthy()
    await user.click(screen.getByRole('button', { name: /log out/i }))

    expect(screen.getByRole('heading', { name: /sign in/i })).toBeTruthy()
    expect(localStorage.getItem('dealership_token')).toBeNull()
  })

  it('shows the complete vehicle filter set and an empty-state message', async () => {
    localStorage.setItem('dealership_token', 'user-token')
    localStorage.setItem('dealership_role', 'USER')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    )

    render(<App />)

    expect(screen.getByLabelText(/model/i)).toBeTruthy()
    expect(screen.getByLabelText(/category/i)).toBeTruthy()
    expect(screen.getByLabelText(/maximum price/i)).toBeTruthy()
    await waitFor(() => expect(screen.getByText(/no vehicles found/i)).toBeTruthy())
  })
})
