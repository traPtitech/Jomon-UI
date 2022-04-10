export const formatDate = (date: string) => {
  return (
    date.split('-')[0] +
    '年' +
    date.split('-')[1] +
    '月' +
    date.split('-')[2].split('T')[0] +
    '日'
  )
}
