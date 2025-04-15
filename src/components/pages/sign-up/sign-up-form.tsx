"use client"

import { useRegister } from "@/features/auth/api/register"
import { sendPost } from "@/lib/axios"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlert } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// first step schema
const registerSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
})

// combined schema type
type RegisterFormValues = z.infer<typeof registerSchema>

export const SignUpForm = () => {
  const [step, setStep] = useState<1 | 2>(1)
  const [userData, setUserData] = useState<RegisterFormValues | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [isErrorStep1, setIsErrorStep1] = useState("")

  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""))

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))
  const [countdown, setCountdown] = useState(60)

  const router = useRouter()

  const signUp = useRegister({
    mutationConfig: {
      onSuccess: () => {
        // router.push("/login")
        setIsComplete(true)
      },
      onError: (error: any) => {
        setIsSubmitting(false)
      },
    },
  })

  // First step form
  const {
    control,
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const countdownInterval = () => {
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Handle first step form submission
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true)
    // Call APi get otp
    try {
      await sendPost("/auth/otp/request", {
        email: data.email,
      })
      setUserData(data)
      setStep(2)
      setIsErrorStep1("")
      setCountdown(60)
    } catch (error: any) {
      setIsErrorStep1(error.response.data.message)
      setIsSubmitting(false)
    }

    countdownInterval()

    setIsSubmitting(false)
  }

  const handleOtpSubmit = async () => {
    setIsSubmitting(true)

    signUp.mutate({
      data: {
        email: userData?.email || "",
        name: userData?.name || "",
        password: userData?.password || "",
        otp: otpValues.join(""),
      },
    })
  }

  const handleResendOtp = async () => {
    try {
      await sendPost("/auth/otp/request", {
        email: userData?.email || "",
      })
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      setCountdown(60)
      countdownInterval()
    } catch (error: any) {
      setIsErrorStep1(error.response.data.message)
      setIsSubmitting(false)
    }
  }

  // Handle back button
  const handleBack = () => {
    setStep(1)
    setOtpValues(Array(6).fill(""))
    setOtpError(null)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow number
    if (!/^\d*$/.test(value)) return

    const newOtpValue = [...otpValues]
    newOtpValue[index] = value.slice(0, 1) // Only allow one character, in case user pastes multiple characters
    setOtpValues(newOtpValue)
    setOtpError(null)

    // Auto focus next input
    if (value && index < 7) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  // Handle keydown for navigation between inputs
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      otpInputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  // Handle paste for OTP
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").trim()

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtpValues(digits)
      otpInputRefs.current[5]?.focus()
    }
  }

  // Reset the form to start over
  const handleReset = () => {
    setStep(1)
    setUserData(null)
    setIsComplete(false)
    setOtpValues(Array(6).fill(""))
    setOtpError(null)
    reset()
  }

  // Focus first OTP input when step changes to 2
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus()
      }, 100)
    }
  }, [step])

  return (
    <div className="rounded-xl min-w-[500px] bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
      <div className="bg-white rounded-2xl px-4 py-10 flex flex-col items-center gap-y-5">
        <div className="flex items-center justify-center">
          <Image
            src="/brand-asset-profile-picture.png"
            alt="PingPanda Avatar"
            width={60}
            height={60}
            className="object-cover rounded-full mr-3"
          />
        </div>
        {!isComplete ? (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-center">
                {step === 1 ? "Create an account" : "Verify your email"}
              </h2>
              <p className="text-center text-gray-500">
                {step === 1 ? (
                  "Enter your information to create an account"
                ) : (
                  <div>
                    We&apos;ve sent a verification code to{" "}
                    <span className="font-bold">{userData?.email}</span>
                    {countdown > 0 && <span>. ({countdown}s)</span>}
                  </div>
                )}
              </p>
            </div>
            <div className="space-y-6 w-full">
              {isErrorStep1 && (
                <div className="p-4 text-red-800 border-2 border-l-[6px] border-red-800 rounded-md flex items-center gap-x-2">
                  <CircleAlert className="w-5 h-5" />
                  <span>{isErrorStep1}</span>
                </div>
              )}
              {step === 1 ? (
                <form
                  onSubmit={handleSubmit(onRegisterSubmit)}
                  className="space-y-6 w-full"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-3 py-3 border rounded-md"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full px-3 py-3 border rounded-md"
                        {...register("name")}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="Create a password"
                        className="w-full px-3 py-3 border rounded-md"
                        {...register("password")}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className=" w-full py-3 px-4 bg-brand-700 text-white rounded-md hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Continue"}
                    {!isSubmitting && (
                      <svg
                        className="ml-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="mb-2">
                      <label className="text-sm font-medium">
                        Verification Code
                      </label>
                    </div>
                    <div className="flex justify-between gap-2 mt-2">
                      {otpValues.map((value, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            otpInputRefs.current[index] = el
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={value}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          className="w-12 h-12 text-center text-lg font-semibold border rounded-md"
                        />
                      ))}
                    </div>
                    {otpError && (
                      <p className="text-sm font-medium text-red-500 mt-2">
                        {otpError}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-center">
                    Didn&apos;t receive a code?{" "}
                    <button
                      className={cn(
                        "text-blue-600 hover:text-blue-700 p-0 underline",
                        countdown > 40 && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={handleResendOtp}
                      disabled={countdown > 40}
                    >
                      Resend
                    </button>
                  </div>
                  <button
                    type="button"
                    className="w-full py-3 px-4 bg-brand-700 text-white rounded-md hover:bg-brand-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                    onClick={handleOtpSubmit}
                  >
                    {isSubmitting ? "Verifying..." : "Complete Registration"}
                  </button>
                  <button
                    type="button"
                    className="w-full py-3 px-4 bg-transparent text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    Back to previous step
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-12 px-6 text-center space-y-4">
            <h2 className="text-2xl font-bold">Registration Complete!</h2>
            <p className="text-base text-gray-500">
              Your account has been successfully created.
            </p>
            <button
              className="mt-4 py-3 px-4 bg-brand-700 text-white rounded-md hover:bg-brand-800"
              onClick={() => {
                router.push(`/login?email=${userData?.email}`)
              }}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
