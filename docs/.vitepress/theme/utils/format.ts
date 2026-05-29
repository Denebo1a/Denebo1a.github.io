export function formatDate(raw: string) {
  const date = new Date(raw)
  return {
    time: +date,
    string: date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

export function formatMonthLabel(time: number) {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1)

  return {
    monthKey: `${year}-${month.padStart(2, '0')}`,
    monthLabel: `${year} 年 ${month} 月`,
  }
}