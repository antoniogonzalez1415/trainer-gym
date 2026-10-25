// Photo for a session, loaded from public/images/<session-id>.jpg.
// If the photo is missing, a colored panel in the category's plate color
// takes its place, so the layout never breaks.

import { useState } from 'react'
import { plateClass } from '../utils/categories.js'

export default function ServiceImage({ service, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`service-image service-image-fallback ${plateClass(service.category)} ${className}`}
        aria-hidden="true"
      >
        <span>{service.category}</span>
      </div>
    )
  }

  return (
    <img
      className={`service-image ${className}`}
      src={`/images/${service.id}.jpg`}
      alt={`${service.name} session`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
