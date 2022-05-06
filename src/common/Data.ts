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
    const result = await axios.get(`${config.API_URL}site/${siteId}`, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem(
          config.LOCAL_STORAGE_API_TOKEN_NAME
        )}`,
      },
    })
    return result.data
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
      `${config.API_URL}quad/destroyed-tiles/${quadId}`,
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

  async getAllArtifracts(): Promise<any> {
    const artifacts = await axios.get(`${config.API_URL}artifact`, {
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
      `${config.API_URL}artifact/${artifactId}`,
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
      `${config.API_URL}quad/artifacts/${quadId}`,
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

  saveDestroyedTile(
    quad_id: number,
    x: number,
    y: number,
    user_id: number,
    callback: (success: boolean, answer: any) => void
  ): void {
    axios
      .post(
        `${config.API_URL}quad/destroyed-tile`,
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
      .then((response: AxiosResponse) => {
        callback(true, response.data)
      })
      .catch((error) => {
        if (error.response) {
          callback(false, error.response)
        } else if (error.request) {
          callback(false, error.request)
        } else {
          callback(false, error.message)
        }
      })
  }

  async saveNewOnmapArtifact(
    artifact_id: number,
    quad_id: number,
    x: number,
    y: number,
    angle: number
  ): Promise<Boolean> {
    try {
      await axios.post(
        `${config.API_URL}quad/artifact`,
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
      return true
    } catch (error) {
      return false
    }
  }

  async deleteOnmapArtifact(
    artifact_id: number,
    quad_id: number,
    x: number,
    y: number
  ): Promise<Boolean> {
    try {
      await axios.post(
        `${config.API_URL}quad/delete_artifact`,
        {
          artifact_id,
          quad_id,
          x: x * 1,
          y: y * 1,
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
    artifact_id: number
    quad_id: number
    x: number
    y: number
    angle: number
  }): Promise<Boolean> {
    const { artifact_id, quad_id, x, y, angle } = data

    try {
      const result = await axios.patch(
        `${config.API_URL}quad/artifact`,
        {
          artifact_id,
          quad_id,
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
      found_weight?: number
      found_height?: number
      found_width?: number
    }
  ) {
    try {
      await axios.post(
        `${config.API_URL}quad/lab`,
        {
          artifact_id,
          quad_id,
          user_id,
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
      return true
    } catch (error) {
      return false
    }
  }
}

export default Data.getInstance()
