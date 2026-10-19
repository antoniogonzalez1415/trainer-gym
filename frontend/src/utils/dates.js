// Date helpers shared by the booking form and the dashboard.
// Rule: the API will receive ISO 8601 strings in UTC; the UI shows local time.

// Bookable start times, every hour from 6:00 to 19:00.
export const TIME_SLOTS = Array.from({ length: 14 }, (_, index) => {
  const hour = String(6 + index).padStart(2, '0')
  return `${hour}:00`
})

// Today's date as YYYY-MM-DD, for the min attribute of <input type="date">.
export function todayInputValue() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

// Combine a local date ("2026-10-22") and time ("09:00") into an ISO string in UTC.
export function toIsoString(date, time) {
  return new Date(`${date}T${time}`).toISOString()
}

export function isInFuture(isoString) {
  return new Date(isoString).getTime() > Date.now()
}

export function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// Split an ISO string back into local date and time values for editing.
export function toInputValues(isoString) {
  const value = new Date(isoString)
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  const hour = String(value.getHours()).padStart(2, '0')
  return { date: `${value.getFullYear()}-${month}-${day}`, time: `${hour}:00` }
}
