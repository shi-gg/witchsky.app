import {BAPP_CONFIG_URL} from '#/env'
import {type Geolocation} from '#/geolocation/types'

export const GEOLOCATION_SERVICE_URL = `${BAPP_CONFIG_URL}/geolocation`

/**
 * Default geolocation config.
 */
// forks tend to get blocked from the geolocation service bluesky uses,
// instead of making our own and grabbing peoples location without their consent,
// lets just force set everyone to be in the US,
// maybe make a tweak in the future that lets ppl customize this
export const FALLBACK_GEOLOCATION_SERVICE_RESPONSE: Geolocation = {
  countryCode: 'US',
  regionCode: 'CA',
}
