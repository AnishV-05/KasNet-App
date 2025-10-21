export const formatDate = (value: Date | string) =>
  new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(typeof value === 'string' ? new Date(value) : value)

export function formatDateVoucher(d: string) {
  const date = new Date(d)
  const datePart = date.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Lima',
  })
  const datePartVoucher = date.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Lima',
  })
  const ampm = date
    .toLocaleString('en-US', {
      hour: '2-digit',
      hour12: true,
      timeZone: 'America/Lima',
    })
    .includes('AM')
    ? 'AM'
    : 'PM'

  const paymentDate = `${datePart.replace(/a\.?\s?m\.?|p\.?\s?m\.?/gi, '').trim()} ${ampm}`
  const paymentDateVoucher = `${datePartVoucher.replace(/a\.?\s?m\.?|p\.?\s?m\.?/gi, '').trim()} ${ampm}`

  let paymentVoucherDate
  let paymentVoucherTime
  if (paymentDateVoucher.includes(',')) {
    paymentVoucherDate = paymentDateVoucher.split(',')[0]?.trim()
    paymentVoucherTime = paymentDateVoucher.split(',')[1]?.trim()
  } else {
    paymentVoucherDate = paymentDateVoucher.slice(0, 10)?.trim()
    paymentVoucherTime = paymentDateVoucher.slice(10)?.trim()
  }

  return {
    paymentDate,
    paymentVoucherDate,
    paymentVoucherTime,
  }
}
