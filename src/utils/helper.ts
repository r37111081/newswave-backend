export function formatToDate () {
  const isoDate = new Date(Date.now())
  const year = isoDate.getFullYear()
  const month = (isoDate.getMonth() + 1).toString().padStart(2, '0')
  const day = isoDate.getDate().toString().padStart(2, '0')
  const hours = isoDate.getHours().toString().padStart(2, '0')
  const minutes = isoDate.getMinutes().toString().padStart(2, '0')
  const seconds = isoDate.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
