// Date and time inputs, used by the booking page and by rescheduling on the dashboard.

import { TIME_SLOTS, todayInputValue } from '../utils/dates.js'

export default function TimeFields({ idPrefix, date, time, onDateChange, onTimeChange }) {
  return (
    <div className="field-row">
      <div className="field">
        <label htmlFor={`${idPrefix}-date`}>Date</label>
        <input
          id={`${idPrefix}-date`}
          type="date"
          min={todayInputValue()}
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-time`}>Start time</label>
        <select
          id={`${idPrefix}-time`}
          value={time}
          onChange={(event) => onTimeChange(event.target.value)}
          required
        >
          <option value="">Choose a time</option>
          {TIME_SLOTS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
