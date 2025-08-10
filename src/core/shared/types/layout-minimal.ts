// Minimal type exports to prevent import errors
export interface SegmentConfig {
  revalidate?: number | false
  dynamic?: 'auto' | 'force-dynamic' | 'error' | 'force-static'
  dynamicParams?: boolean
}

export type LayoutProps = {
  children?: React.ReactNode
  params?: Record<string, string | string[]>
}

export type GenerateStaticParams = {
  __tag__: 'generateStaticParams'
  __return_type__: any[] | Promise<any[]>
}
