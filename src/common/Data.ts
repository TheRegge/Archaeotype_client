import fakeTilesData from '../../public/assets/fakeTilesData.json'
import artifactsData from '../../public/assets/artifacts.json'
import config from './Config'

import axios, { AxiosResponse } from 'axios'

export class Data {
  private static instance: Data

  private constructor() {
    // Just here as private so class cannot be instantiated
    // from outside
  }

  public static getInstance(): Data {
    if (!Data.instance) {
      Data.instance = new Data()
    }
    return Data.instance
  }

  async getSiteQuads(siteId: number): Promise<any> {
    const result = await axios.get(`${process.env.API_URL}site/${siteId}`, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem(
          config.LOCAL_STORAGE_API_TOKEN_NAME
        )}`,
      },
    })
    return result.data
  }

  async getQuad(quadId: number): Promise<any> {
    const quad = await axios.get(`${process.env.API_URL}quad/${quadId}`, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem(
          config.LOCAL_STORAGE_API_TOKEN_NAME
        )}`,
      },
    })
    return quad.data
  }

  /**
   * Fetch tiles from data layer
   *
   * @param {number} quadId
   * @returns {Promise<number[][]>}
   * @memberof Data
   */
  async getTiles(quadId: number): Promise<number[][]> {
    const destroyedTiles = await axios.get(
      `${process.env.API_URL}quad/destroyed-tiles/${quadId}`,
      {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(
            config.LOCAL_STORAGE_API_TOKEN_NAME
          )}`,
        },
      }
    )

    let tilesH = config.NUM_TILES_WIDTH
    let tilesV = config.NUM_TILES_HEIGHT
    let tiles = new Array()

    // console.time('destroyedTiles')
    for (let v = 0; v < tilesV; v++) {
      let row = new Array()
      for (let h = 0; h < tilesH; h++) {
        const positionOnMap = { x: `${h}`, y: `${v}` }

        const isDestroyed = destroyedTiles.data.findIndex((destroyedTile) => {
          return (
            destroyedTile.x === positionOnMap.x &&
            destroyedTile.y === positionOnMap.y
          )
        })
        isDestroyed < 0 ? row.push(0) : row.push(-1)
      }
      tiles.push(row)
    }
    // console.timeEnd('destroyedTiles')

    return tiles
  }

  async getAllArtifacts(): Promise<any> {
    const artifacts = await axios.get(`${process.env.API_URL}artifact`, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem(
          config.LOCAL_STORAGE_API_TOKEN_NAME
        )}`,
      },
    })
    return artifacts.data
  }

  async getUnplacedArtifact(artifactId: number): Promise<any> {
    const artifact = await axios.get(
      `${process.env.API_URL}artifact/${artifactId}`,
      {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(
            config.LOCAL_STORAGE_API_TOKEN_NAME
          )}`,
        },
      }
    )
    return artifact.data
  }

  async getArtifactsOnQuad(quadId: number) {
    const artifacts = await axios.get(
      `${process.env.API_URL}quad/artifacts/${quadId}`,
      {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(
            config.LOCAL_STORAGE_API_TOKEN_NAME
          )}`,
        },
      }
    )
    return artifacts.data
  }

  async saveDestroyedTile(
    quad_id: number,
    x: number,
    y: number,
    user_id: number
    // callback: (success: boolean, answer: any) => void
  ): Promise<any> {
    return await axios
      .post(
        `${process.env.API_URL}quad/destroyed-tile`,
        {
          quad_id,
          x,
          y,
          user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              config.LOCAL_STORAGE_API_TOKEN_NAME
            )}`,
          },
        }
      )
      .catch((error) => {
        if (error.response) {
          return error.response
        } else if (error.request) {
          return error.request
        } else {
          return error.message
        }
      })
  }

  async saveNewOnmapArtifact(
    artifact_id: number,
    quad_id: number,
    x: number,
    y: number,
    angle: number
  ): Promise<number> {
    try {
      const result = await axios.post(
        `${process.env.API_URL}quad/artifact`,
        {
          artifact_id,
          quad_id,
          x: x * 1,
          y: y * 1,
          angle,
        },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              config.LOCAL_STORAGE_API_TOKEN_NAME
            )}`,
          },
        }
      )
      return result.data.insertID
    } catch (error) {
      return 0
    }
  }

  async deleteOnmapArtifact(onmap_id: number): Promise<Boolean> {
    try {
      await axios.post(
        `${process.env.API_URL}deleteartifact`,
        {
          onmap_id,
        },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              config.LOCAL_STORAGE_API_TOKEN_NAME
            )}`,
          },
        }
      )
      return true
    } catch (error) {
      return false
    }
  }

  async updateArtifactOnMap(data: {
    onmap_id: number
    x: number
    y: number
    angle: number
  }): Promise<Boolean> {
    const { onmap_id, x, y, angle } = data
    try {
      const result = await axios.patch(
        `${process.env.API_URL}quad/artifact`,
        {
          onmap_id,
          x,
          y,
          angle,
        },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              config.LOCAL_STORAGE_API_TOKEN_NAME
            )}`,
          },
        }
      )
      return true
    } catch (error) {
      return false
    }
  }

  async saveLabData(
    onmap_id: number,
    artifact_id: number,
    quad_id: number,
    user_id: number,
    username: string,
    fields: {
      found_colors: string
      found_column: number | string
      found_label: string
      found_row: number | string
      found_materials: string
      found_weight?: string
      found_height?: string
      found_width?: string
    }
  ): Promise<any> {
    return await axios
      .post(
        `${process.env.API_URL}quad/lab`,
        {
          onmap_id,
          artifact_id,
          quad_id: quad_id.toString(),
          user_id: user_id.toString(),
          username,
          ...fields,
        },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              config.LOCAL_STORAGE_API_TOKEN_NAME
            )}`,
          },
        }
      )
      .catch((error) => {
        if (error.response?.data) {
          return error.response.data
        } else if (error.request) {
          return error.request
        } else {
          return error.message
        }
      })
  }

  async getFoundArtifact(onMapId: number) {
    const foundArtifact = await axios.get(
      `${process.env.API_URL}quad/artifact/found/${onMapId}`,
      {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(
            config.LOCAL_STORAGE_API_TOKEN_NAME
          )}`,
        },
      }
    )
    return foundArtifact.data
  }

  async getProjectCollection(projectId: number) {
    const collection = await axios.get(
      `${process.env.API_URL}project/collection/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(
            config.LOCAL_STORAGE_API_TOKEN_NAME
          )}`,
        },
      }
    )
    return collection.data
  }

  async unlockQuad(quadId: number) {
    try {
      const result = await axios.post(
        `${process.env.API_URL}quad/unlock`,
        {
          quad_id: quadId,
        },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              config.LOCAL_STORAGE_API_TOKEN_NAME
            )}`,
          },
        }
      )
      return result.data
    } catch (error) {
      return error
    }
  }
}

export default Data.getInstance()
