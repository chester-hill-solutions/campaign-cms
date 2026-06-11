import { useId } from 'react'

/** Labeled text input matching the host admin theme (`admin-field` tokens). */
export function AdminTextInput({
  label,
  hint,
  id: idProp,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: React.ReactNode
}) {
  const generatedId = useId()
  const inputId = idProp ?? generatedId

  return (
    <div className="admin-field">
      <label htmlFor={inputId} className="admin-field__label">
        {label}
      </label>
      <input
        {...props}
        id={inputId}
        className={`admin-field__input focus-ring ${className ?? ''}`}
      />
      {hint ? <span className="admin-field__hint">{hint}</span> : null}
    </div>
  )
}

export function AdminTextArea({
  label,
  hint,
  id: idProp,
  className,
  rows = 3,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  hint?: React.ReactNode
}) {
  const generatedId = useId()
  const inputId = idProp ?? generatedId

  return (
    <div className="admin-field">
      <label htmlFor={inputId} className="admin-field__label">
        {label}
      </label>
      <textarea
        {...props}
        id={inputId}
        rows={rows}
        className={`admin-field__input focus-ring ${className ?? ''}`}
      />
      {hint ? <span className="admin-field__hint">{hint}</span> : null}
    </div>
  )
}

export function AdminCheckbox({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="admin-checkbox">
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  )
}
