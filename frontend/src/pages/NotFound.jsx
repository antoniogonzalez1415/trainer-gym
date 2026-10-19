import { Link } from 'react-router'

export default function NotFound() {
  return (
    <section className="section container narrow">
      <h1>Page not found</h1>
      <p>The address may be mistyped, or the page has moved.</p>
      <Link to="/" className="button button-primary">
        Go to the home page
      </Link>
    </section>
  )
}
