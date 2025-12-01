import {useCallback, useEffect, useRef, useState} from 'react'
import {type StyleProp, View, type ViewStyle} from 'react-native'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import {useHaptics} from '#/lib/haptics'
import {atoms as a, platform, useTheme} from '#/alf'

export interface SliderProps {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  accessibilityHint?: string
  style?: StyleProp<ViewStyle>
  debounce?: number
}

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  accessibilityHint,
  style,
  debounce,
}: SliderProps) {
  const t = useTheme()
  const playHaptic = useHaptics()
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const [width, setWidth] = useState(0)

  const progress = useSharedValue(0)
  const isPressed = useSharedValue(false)

  useEffect(() => {
    if (!isPressed.value) {
      const clamped = Math.min(Math.max(value, min), max)
      const normalized = (clamped - min) / (max - min)
      progress.value = withSpring(normalized, {overshootClamping: true})
    }
  }, [value, min, max, progress, isPressed])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const updateValueJS = useCallback(
    (val: number) => {
      if (debounce && debounce > 0) {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(() => {
          onValueChange(val)
        }, debounce)
      } else {
        onValueChange(val)
      }
    },
    [onValueChange, debounce],
  )

  const handleValueChange = useCallback(
    (newProgress: number) => {
      'worklet'
      const rawValue = min + newProgress * (max - min)

      const steppedValue = Math.round(rawValue / step) * step
      const clamped = Math.min(Math.max(steppedValue, min), max)

      runOnJS(updateValueJS)(clamped)
    },
    [min, max, step, updateValueJS],
  )

  const pan = Gesture.Pan()
    .onBegin(e => {
      isPressed.value = true

      if (width > 0) {
        const newProgress = Math.min(Math.max(e.x / width, 0), 1)
        progress.value = newProgress
        handleValueChange(newProgress)
      }
    })
    .onUpdate(e => {
      if (width === 0) return
      const newProgress = Math.min(Math.max(e.x / width, 0), 1)
      progress.value = newProgress
      handleValueChange(newProgress)
    })
    .onFinalize(() => {
      isPressed.value = false
      runOnJS(playHaptic)('Light')
    })

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const translateX = progress.value * width
    return {
      transform: [
        {translateX: translateX - 12},
        {scale: isPressed.value ? 1.1 : 1},
      ],
    }
  })

  const trackAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    }
  })

  return (
    <View
      style={[a.w_full, a.justify_center, {height: 28}, style]}
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityValue={{min, max, now: value}}>
      <GestureDetector gesture={pan}>
        <View
          style={[a.flex_1, a.justify_center, {cursor: 'pointer'}]}
          // @ts-ignore web-only style
          onLayout={e => setWidth(e.nativeEvent.layout.width)}>
          <View
            style={[
              a.w_full,
              a.absolute,
              t.atoms.bg_contrast_50,
              {height: 4, borderRadius: 2},
            ]}
          />

          <Animated.View
            style={[
              a.absolute,
              a.rounded_full,
              {height: 4, backgroundColor: t.palette.primary_500},
              trackAnimatedStyle,
            ]}
          />

          <Animated.View
            style={[
              a.absolute,
              a.rounded_full,
              t.atoms.bg,
              {
                left: 0,
                width: 24,
                height: 24,
                borderWidth: 1,
                borderColor: t.atoms.border_contrast_low.borderColor,
              },
              thumbAnimatedStyle,
              platform({
                web: {
                  boxShadow: '0px 2px 4px 0px #0000001A',
                },
                ios: {
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                },
                android: {elevation: 3},
              }),
            ]}
          />
        </View>
      </GestureDetector>
    </View>
  )
}
