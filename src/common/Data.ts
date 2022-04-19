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

  getArtifacts(quadId: number) {
    return new Promise((resolve, reject) => {
      const quad = artifactsData.data.filter((item) => item.id === quadId)
      const firstRow = quad[0]
      if (!firstRow)
        reject(`Could not find artifacts for quad with id: ${quadId}`)
      resolve(firstRow.artifacts)
    })
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
}

export default Data.getInstance()
