import useNotification from "@/app/hooks/use-notification"
import { sendPost } from "@/lib/axios"
import { MutationConfig } from "@/lib/react-query"
import { handleErrorMessage } from "@/utils/helper"
import { useMutation } from "@tanstack/react-query"

interface RegisterInput {
  email: string
  name: string
  password: string
  otp: string
}

export const register = ({ data }: { data: RegisterInput }) => {
  return sendPost("/auth/register", data)
}

type UseRegisterPropsActions = {
  mutationConfig?: MutationConfig<typeof register>
}

export const useRegister = ({
  mutationConfig,
}: UseRegisterPropsActions = {}) => {
  const { onSuccess, onError, ...restConfig } = mutationConfig || {}
  const { notify } = useNotification()

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args)
      notify("Register successfully", { variant: "success" })
    },
    onError: (error, ...args) => {
      onError?.(error, ...args)
      notify(handleErrorMessage(error), { variant: "error" })
    },
    ...restConfig,
    mutationFn: register,
  })
}
