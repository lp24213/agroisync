// Tipos globais para o projeto AgroSync (convertido para JS)

// Interfaces convertidas para JSDoc

/**
 * @typedef {Object} Location
 * @property {number} latitude
 * @property {number} longitude
 */

/**
 * @typedef {Object} RegionInfo
 * @property {string} city
 * @property {string} state
 * @property {string} region
 * @property {string} country
 * @property {string} timezone
 */

/**
 * @typedef {Object} GrainData
 * @property {string} id
 * @property {string} grain
 * @property {string} symbol
 * @property {number} price
 * @property {number} change24h
 * @property {number} changePercent
 * @property {number} volume
 * @property {string} unit
 * @property {string} region
 * @property {string} source
 * @property {string} lastUpdate
 * @property {number} [marketCap]
 * @property {number} [high24h]
 * @property {number} [low24h]
 */

/**
 * @typedef {Object} MarketData
 * @property {number} totalVolume
 * @property {number} totalMarketCap
 * @property {number} averageChange
 * @property {GrainData[]} topGainers
 * @property {GrainData[]} topLosers
 * @property {GrainData[]} mostTraded
 */

/**
 * @typedef {Object} FuturesContract
 * @property {string} id
 * @property {string} grain
 * @property {string} symbol
 * @property {string} month
 * @property {number} year
 * @property {number} lastPrice
 * @property {number} change
 * @property {number} changePercent
 * @property {number} volume
 * @property {number} openInterest
 * @property {number} high
 * @property {number} low
 * @property {number} settlement
 */

/**
 * @typedef {Object} ExportData
 * @property {string} id
 * @property {string} country
 * @property {string} grain
 * @property {number} exportVolume
 * @property {number} exportValue
 * @property {number} importVolume
 * @property {number} importValue
 * @property {number} netTrade
 * @property {number} year
 * @property {string} month
 * @property {string} region
 */

/**
 * @typedef {Object} AgrolinkResponse
 * @property {boolean} success
 * @property {*} [data]
 * @property {string} [error]
 * @property {string} timestamp
 */

/**
 * @typedef {Object} AgrolinkConfig
 * @property {string} [apiKey]
 * @property {string} baseUrl
 * @property {number} timeout
 * @property {number} maxRetries
 */

// Exportar vazio para compatibilidade
export {}
