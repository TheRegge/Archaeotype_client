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
