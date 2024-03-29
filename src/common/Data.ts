import config from './Config'

import axios from 'axios'
import { ReturnedArtifactData } from './Types'

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

  /**
   * Reset tiles for a quad
   *
   * @param {number} quadId
   * @param {string} resetMode defaults to '' which means soft reset
   * @returns {Promise<any>}
   * @memberof Data
   */
  async resetTiles(quadId: number, resetMode: string = ''): Promise<any> {
    return await axios
      .post(
        `${process.env.API_URL}quad/reset-tiles`,
        { quadId, resetMode },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              config.LOCAL_STORAGE_API_TOKEN_NAME
            )}`,
          },
        }
      )
      .catch((error) => {
        console.log(error)
      })
  }

  async rotateArtifacts(quadId: number, rotateMode: string = ''): Promise<any> {
    return await axios
      .post(
        `${process.env.API_URL}quad/rotate-artifacts`,
        { quadId, rotateMode },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              config.LOCAL_STORAGE_API_TOKEN_NAME
            )}`,
          },
        }
      )
      .catch((error) => {
        console.log(error)
      })
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

  /**
   * Gets duplicate artifacts on quad
   *
   * The data about duplicates artifacts on each quad is cached in the db
   * to enable the auto-labeling feature. Auto-labeling is a feature that
   * automatically labels artifacts on a quad when there are multiple artifacts
   * of the same type on the quad.
   *
   * @param projectId
   * @param siteId
   * @param quadId
   * @returns data describing the duplicate artifacts on quad.
   */
  async getDuplicateArtifactsOnQuad(
    projectId,
    siteId,
    quadId
  ): Promise<ReturnedArtifactData> {
    const dups = await axios.get(
      `${process.env.API_URL}quad/artifacts/duplicates/${projectId}/${siteId}/${quadId}`,
      {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(
            config.LOCAL_STORAGE_API_TOKEN_NAME
          )}`,
        },
      }
    )
    return dups.data
  }

  /**
   * Saves duplicate artifacts on quad
   * @param projectId
   * @param siteId
   * @param quadId
   * @param dupsData
   * @returns duplicate artifacts on quad
   */
  async saveDuplicateArtifactsOnQuad(
    projectId,
    siteId,
    quadId,
    dupsData
  ): Promise<any> {
    const result = await axios.post(
      `${process.env.API_URL}quad/artifacts/duplicates`,
      {
        projectId,
        siteId,
        quadId,
        dupsData: JSON.stringify(dupsData),
      },
      {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(
            config.LOCAL_STORAGE_API_TOKEN_NAME
          )}`,
        },
      }
    )
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

  async saveHiddenTiles(quad_id: number, user_id: number): Promise<any> {
    return await axios
      .post(
        `${process.env.API_URL}quad/hidden-tiles`,
        {
          quad_id,
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
    site_id: string,
    project_id: string,
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
          site_id,
          project_id,
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

  async updateCollectionItemNotes(
    user_id: number,
    onmap_id: number,
    artifact_id: number,
    quad_id: number,
    found_notes: string
  ): Promise<any> {
    return await axios
      .post(
        `${process.env.API_URL}quad/lab/notes`,
        {
          user_id,
          onmap_id,
          artifact_id,
          quad_id: quad_id.toString(),
          found_notes,
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

  async getProjectCollection(projectId: number, quadId?: number) {
    let requestUrl = `${process.env.API_URL}project/collection/${projectId}`
    if (quadId) {
      requestUrl = `${process.env.API_URL}project/collection/${projectId}/?quad_id=${quadId}`
    }
    const collection = await axios.get(requestUrl, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem(
          config.LOCAL_STORAGE_API_TOKEN_NAME
        )}`,
      },
    })
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
