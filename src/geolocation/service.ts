import {useEffect, useState} from 'react'
import EventEmitter from 'eventemitter3'

import {FALLBACK_GEOLOCATION_SERVICE_RESPONSE} from '#/geolocation/const'
import * as debug from '#/geolocation/debug'
import {logger} from '#/geolocation/logger'
import {type Geolocation} from '#/geolocation/types'
import {device} from '#/storage'

const geolocationData = FALLBACK_GEOLOCATION_SERVICE_RESPONSE
const events = new EventEmitter()
const EVENT = 'geolocation-service-response-updated'
const emitGeolocationServiceResponseUpdate = (data: Geolocation) => {
  events.emit(EVENT, data)
}
const onGeolocationServiceResponseUpdate = (
  listener: (data: Geolocation) => void,
) => {
  events.on(EVENT, listener)
  return () => {
    events.off(EVENT, listener)
  }
}

async function fetchGeolocationServiceData(): Promise<Geolocation | undefined> {
  if (debug.enabled) return debug.resolve(debug.geolocation)
  // Return local geolocation data instead of making HTTP request
  return geolocationData as Geolocation
}

/**
 * Local promise used within this file only.
 */
let geolocationServicePromise: Promise<{success: boolean}> | undefined

/**
 * Begin the process of resolving geolocation config. This is called right away
 * at app start, and the promise is awaited later before proceeding with app
 * startup.
 */
export async function resolve() {
  if (geolocationServicePromise) {
    const cached = device.get(['geolocationServiceResponse'])
    if (cached) {
      logger.debug(`resolve(): using cache`)
    } else {
      logger.debug(`resolve(): no cache`)
      const {success} = await geolocationServicePromise
      if (success) {
        logger.debug(`resolve(): resolved`)
      } else {
        logger.info(`resolve(): failed`)
      }
    }
  } else {
    logger.debug(`resolve(): initiating`)

    geolocationServicePromise = new Promise(async resolvePromise => {
      let success = false

      function cacheResponseOrThrow(response: Geolocation | undefined) {
        if (response) {
          device.set(['geolocationServiceResponse'], response)
          emitGeolocationServiceResponseUpdate(response)
        } else {
          throw new Error(`fetchGeolocationServiceData returned no data`)
        }
      }

      try {
        // Use local data - no need to retry or handle network errors
        const config = await fetchGeolocationServiceData()
        cacheResponseOrThrow(config)
        success = true
      } catch (e: any) {
        logger.debug(`resolve(): fetchGeolocationServiceData failed`, {
          safeMessage: e.message,
        })
      } finally {
        resolvePromise({success})
      }
    })
  }
}

export function useGeolocationServiceResponse() {
  const [config, setConfig] = useState(() => {
    const initial =
      device.get(['geolocationServiceResponse']) ||
      FALLBACK_GEOLOCATION_SERVICE_RESPONSE
    return initial
  })

  useEffect(() => {
    return onGeolocationServiceResponseUpdate(config => {
      setConfig(config)
    })
  }, [])

  return config
}
