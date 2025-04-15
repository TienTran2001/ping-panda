export const handleErrorMessage = (error: any) => {
  if (error?.response?.data?.message) {
    return error?.response?.data?.message
  }

  return "Something went wrong"
}
