export type Tab =
  | 'overview'
  | 'campaign'
  | 'creative'
  | 'audience'
  | 'budget'
  | 'conversion'
  | 'settings'
  | 'campaigns'
  | 'datainput'
  | 'users'

export interface DailyRow {
  report_date: string
  spend: number
  impressions: number
  clicks: number
  conversions_7d_click: number
  conversion_value: number
  platform_name: string
}

export type PlatformFilter = 'All' | 'Meta' | 'Google' | 'TikTok'
export type PeriodFilter = 'Last 7 days' | 'Last 30 days' | 'Custom'

export interface DateRange {
  from: string // YYYY-MM-DD
  to: string   // YYYY-MM-DD
}

export interface FilterState {
  platform: PlatformFilter
  period: PeriodFilter
  dateRange: DateRange | null
}

export interface GlobalData {
  rows: DailyRow[]
  loading: boolean
  refetch: () => void
  // Filter yang aktif — dipakai semua tab untuk memfilter data
  filters: FilterState
}
