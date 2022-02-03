import fakeTilesData from '../../public/assets/fakeTilesData.json'
import artifactsData from '../../public/assets/artifacts.json'

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
  getTiles(quadId: number): Promise<number[][]> {
    return new Promise((resolve, reject) => {
      const quad = fakeTilesData.data.filter((item) => item.id === quadId)
      const firstRow = quad[0]
      if (!firstRow) reject(`Could not find tiles for quad with id: ${quadId}`)
      resolve(firstRow.tiles)
    })
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
}

export default Data.getInstance()
