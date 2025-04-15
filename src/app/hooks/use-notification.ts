"use client"
import { useSnackbar } from "notistack"

const useNotification = () => {
  const { enqueueSnackbar: notify, closeSnackbar: closeNotify } = useSnackbar()

  return { notify, closeNotify }
}

export default useNotification
