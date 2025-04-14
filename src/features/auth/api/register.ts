import { sendPost } from "@/lib/axios"
import { MutationConfig } from "@/lib/react-query"

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

export const useRegister = ({}) => {}
