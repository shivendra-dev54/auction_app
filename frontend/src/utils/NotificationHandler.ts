import { toast } from "sonner"

export const SuccessNotificationHandler = (msg: string) => {
  toast.success(msg);
}

export const ErrorNotificationHandler = (msg: string) => {
  toast.error(msg);
}