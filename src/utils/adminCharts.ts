import type { DailyMetric, StatusCount } from '@/types/auth'

export const CHART_COLORS = [
  '#86bc42',
  '#4f8cff',
  '#e85d8a',
  '#f5a623',
  '#9b6dff',
  '#2ec4b6',
  '#ff6b6b',
  '#48cae4',
]

export function barHeight(value: number, max: number) {
  return Math.max(6, Math.round((value / max) * 100))
}

export function barWidth(value: number, max: number) {
  return Math.max(4, Math.round((value / max) * 100))
}

export function shortDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function maxMetric(points: DailyMetric[], key: 'count' | 'revenue') {
  return Math.max(1, ...points.map((p) => p[key]))
}

export function maxStatusCount(rows: StatusCount[]) {
  return Math.max(1, ...rows.map((r) => r.count))
}

export function donutGradient(
  segments: { value: number; color: string }[],
  total: number,
) {
  if (total <= 0) return 'conic-gradient(#e8e6e0 0deg 360deg)'
  let acc = 0
  const parts = segments
    .filter((s) => s.value > 0)
    .map((segment) => {
      const slice = (segment.value / total) * 100
      const start = acc
      acc += slice
      return `${segment.color} ${start}% ${acc}%`
    })
  return `conic-gradient(${parts.join(', ')})`
}
