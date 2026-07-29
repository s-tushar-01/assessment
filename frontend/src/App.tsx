function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-cyan-950/30">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Dealership inventory
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400">
          Access the vehicle inventory dashboard.
        </p>
        <form className="mt-8 space-y-5">
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
            />
          </div>
          <button
            className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  )
}

export default App
