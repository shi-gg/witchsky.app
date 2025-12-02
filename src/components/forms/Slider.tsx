import {useCallback, useEffect, useMemo, useState} from 'react'
import {type ViewStyle} from 'react-native'
import RNSlider from '@react-native-community/slider'
import {throttle} from 'lodash'

import {useTheme} from '#/alf'

interface SliderProps {
  value: number
  onValueChange: (value: number) => void
  minimumValue?: number
  maximumValue?: number
  step?: number
  sliderStyle?: ViewStyle
}

export function Slider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 1,
  step = 1,
  sliderStyle,
}: SliderProps) {
  const t = useTheme()

  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const throttledOnValueChange = useMemo(
    () =>
      throttle(
        (val: number) => {
          onValueChange(val)
        },
        50,
        {leading: true, trailing: true},
      ),
    [onValueChange],
  )

  const handleValueChange = useCallback(
    (val: number) => {
      setLocalValue(val)
      throttledOnValueChange(val)
    },
    [throttledOnValueChange],
  )

  const handleSlidingComplete = useCallback(
    (val: number) => {
      throttledOnValueChange.cancel()
      onValueChange(val)
    },
    [throttledOnValueChange, onValueChange],
  )

  return (
    <RNSlider
      value={localValue}
      onValueChange={handleValueChange}
      onSlidingComplete={handleSlidingComplete}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      step={step}
      minimumTrackTintColor={t.palette.primary_500}
      maximumTrackTintColor={t.atoms.bg_contrast_50.backgroundColor}
      thumbTintColor={t.atoms.bg_contrast_500.backgroundColor}
      thumbImage={undefined}
      style={[
        {
          height: 40,
        },
        sliderStyle,
      ]}
    />
  )
}
