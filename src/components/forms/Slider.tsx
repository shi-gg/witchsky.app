import {type ViewStyle} from 'react-native'
import {Slider as RNSlider} from '@miblanchard/react-native-slider'

import {useTheme} from '#/alf'

interface SliderProps {
  value: number
  onValueChange: (value: number) => void
  minimumValue?: number
  maximumValue?: number
  step?: number
  trackStyle?: ViewStyle
  minimumTrackStyle?: ViewStyle
  thumbStyle?: ViewStyle
  thumbTouchSize?: {width: number; height: number}
}

export function Slider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 1,
  step = 1,
  trackStyle,
  minimumTrackStyle,
  thumbStyle,
  thumbTouchSize = {width: 40, height: 40},
}: SliderProps) {
  const t = useTheme()

  return (
    <RNSlider
      value={[value]} // always an array
      onValueChange={values => onValueChange(values[0])}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      step={step}
      trackStyle={{
        height: 4,
        borderRadius: 2,
        backgroundColor: t.atoms.bg_contrast_50.backgroundColor,
        ...trackStyle,
      }}
      minimumTrackStyle={{
        height: 4,
        borderRadius: 2,
        backgroundColor: t.palette.primary_500,
        ...minimumTrackStyle,
      }}
      thumbStyle={{
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: t.atoms.border_contrast_low.borderColor,
        backgroundColor: t.atoms.bg.backgroundColor,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
        ...thumbStyle,
      }}
      thumbTouchSize={thumbTouchSize}
    />
  )
}
