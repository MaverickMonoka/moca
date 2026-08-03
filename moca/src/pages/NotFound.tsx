import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center">
      <span className="font-display text-7xl font-bold text-white/10">404</span>
      <h1 className="mt-4 text-2xl font-bold">This page doesn't exist</h1>
      <p className="mt-2 text-white/50">Let's get you back to opportunity.</p>
      <Link to="/" className="btn-primary mt-8">
        Back to MOCA
      </Link>
    </div>
  )
}
