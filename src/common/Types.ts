export type Quad = {
  id: number
  name: string
  description: string
  bgFilename: string
  project_id: number
  tilesetfilename: string
  x: number
  y: number
}

export type QuadPointerState = 'play' | 'edit' | 'delete' | 'add'

export type User = {
  email: string
  firstname: string
  id: number
  lastname: string
  quad_id?: number
  quad?: Quad
  role_id: number
  username: string
}

export type UpdatableElement = {
  el: HTMLElement | HTMLInputElement
  data: { valueType: string; value: string | number }
  action?: {
    event: string
    callback: (e) => void
  }
}

export type ArtifactData = {
  id: string
  mapId: string
  name: string
  coordinatesInMeters: { x: number; y: number }
  imageSizeInPixels: { width: number; height: number }
  weight: number
  height: number
  width: number
  angle: number
  isPainting: boolean
  materials: string[]
  fileName: string
  src: string
  altSrc: string[]
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
