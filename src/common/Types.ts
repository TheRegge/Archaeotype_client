export type Quad = {
  id: number
  name: string
  description: string
  bgFilename: string
  project_id: number
  siteId?: number
  siteName?: string
  tilesetfilename: string
  x: number
  y: number
}

export type QuadPointerState = 'play' | 'edit' | 'delete' | 'add' | 'reveal'

export type DuplicateArtifactData = {
  id: number
  found_label: string
  found_colors: string
  found_notes: string
  count: number
}

export type ReturnedArtifactData = {
  project_id: string
  site_id: string
  quad_id: string
  data: string
}

export type User = {
  email: string
  firstname: string
  id: number
  lastname: string
  quad_id?: number
  quad?: Quad
  role_id: number
  site_id?: number
  site_name?: string
  project_id?: number
  username: string
}

export type UpdatableElement = {
  el: HTMLElement | HTMLInputElement
  data: { valueType: string; value: string | number }
  action?: {
    event: string
    once?: boolean
    callback: (e) => void
  }
}

export type ArtifactData = {
  id: string
  siteId?: string
  mapId: string
  onmap_id?: number
  projectId?: string
  name: string
  coordinatesInMeters: { x: number; y: number }
  imageSizeInPixels: { width: number; height: number }
  weight: number
  height: number
  width: number
  angle: number
  isFound?: boolean
  found_label?: string
  found_colors?: string
  found_notes?: string
  isPainting: boolean
  materials: string[]
  fileName: string
  src: string
  altSrc: string[]
  width_onmap?: number
  height_onmap?: number
}

export type ArtifactInChoserData = {
  id: string
  name: string
  width: number
  height: number
  mainImageId?: number
  inscriptions?: string[]
  label?: string
}
