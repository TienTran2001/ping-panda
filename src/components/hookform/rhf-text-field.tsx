"use client"

import { Control, Controller } from "react-hook-form"

export type RHFTextFieldProps = {
  name: string
  control: Control<any>
  label?: string
  type?: string
  error?: boolean
  errorMessage?: string
  min?: number
  max?: number
}

export const RHFTextField = ({
  name,
  control,
  label,
  type = "text",
  error,
  errorMessage,
  min = 1,
  max = 99999,
  ...others
}: RHFTextFieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-black">{label}</label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type={type}
            className={`w-full p-2 text-sm border rounded-md bg-white ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            onChange={(event) => {
              if (type === "number") {
                let inputValue = event.target.value
                if (inputValue.length > 5) inputValue = inputValue.slice(0, 5)

                const numericValue = parseInt(inputValue, 10)
                const finalValue = Math.min(
                  Math.max(numericValue || min, min),
                  max
                )

                field.onChange(finalValue)
              } else {
                field.onChange(event)
              }
            }}
            onBlur={(event) => {
              if (type === "number" && !event.target.value) {
                event.target.value = min.toString()
                field.onChange(min)
              }
            }}
            {...others}
          />
        )}
      />
      {error && <span className="text-xs text-red-500">{errorMessage}</span>}
    </div>
  )
}
