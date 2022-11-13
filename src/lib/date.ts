import type { DateTime } from 'luxon'

export const formatDate = (date: DateTime) => {
  const dateStr = date.toFormat('yyyy/MM/dd')
  return dateStr
}

export const formatDateAndTime = (date: DateTime) => {
  const dateStr = date.toFormat('yyyy/MM/dd HH:mm')
  return dateStr
}
