import { Outlet, Link } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-4">
      <Link to="/" className="text-primary-400 font-bold text-2xl mb-8 tracking-tight">
        Rekrutrek
      </Link>
      <div className="w-full max-w-sm bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8">
        <Outlet />
      </div>
    </div>
  )
}
