import { useEffect, useState } from 'react'
import { useSiteContent } from '../context/SiteContentContext'

function getInitials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** Profile photo with a graceful initials fallback when no photo is set (or it fails to load). */
export default function Avatar({ className = '' }) {
  const { profile } = useSiteContent()
  const [errored, setErrored] = useState(false)

  // Give a freshly-edited photo path a fresh chance to load, even after a previous one failed.
  useEffect(() => setErrored(false), [profile.photo])

  const showPhoto = profile.photo && !errored

  if (showPhoto) {
    return (
      <img
        src={profile.photo}
        alt={profile.name}
        onError={() => setErrored(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-panel-2 font-mono text-4xl font-bold text-gold ${className}`}
    >
      {getInitials(profile.name)}
    </div>
  )
}
