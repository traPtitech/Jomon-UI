import { DateTime } from 'luxon'

export const formatDate = (date: string) => {
  const dateStr = DateTime.fromISO(date).toFormat('yyyy/MM/dd')
  return dateStr
}

export const formatDateAndTime = (date: string) => {
  const dateStr = DateTime.fromISO(date).toFormat('yyyy/MM/dd HH:mm')
  return dateStr
}
