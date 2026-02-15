import React from 'react'
import {
  ActivityIndicator,
  type ImageStyle,
  useWindowDimensions,
  View,
} from 'react-native'
import {EncodingType, readAsStringAsync} from 'expo-file-system/legacy'
import {Image} from 'expo-image'
import {msg, Plural, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'

import {generateAltText} from '#/lib/ai/generateAltText'
import {DEFAULT_ALT_TEXT_AI_MODEL, MAX_ALT_TEXT} from '#/lib/constants'
import {useIsKeyboardVisible} from '#/lib/hooks/useIsKeyboardVisible'
import {enforceLen} from '#/lib/strings/helpers'
import {type ComposerImage} from '#/state/gallery'
import {
  useOpenRouterApiKey,
  useOpenRouterConfigured,
  useOpenRouterModel,
} from '#/state/preferences/openrouter'
import {AltTextCounterWrapper} from '#/view/com/composer/AltTextCounterWrapper'
import {atoms as a, useTheme} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import * as Dialog from '#/components/Dialog'
import {type DialogControlProps} from '#/components/Dialog'
import * as TextField from '#/components/forms/TextField'
import {CircleInfo_Stroke2_Corner0_Rounded as CircleInfo} from '#/components/icons/CircleInfo'
import {Sparkle_Stroke2_Corner0_Rounded as SparkleIcon} from '#/components/icons/Sparkle'
import {Text} from '#/components/Typography'
import {IS_ANDROID, IS_WEB} from '#/env'

type Props = {
  control: Dialog.DialogOuterProps['control']
  image: ComposerImage
  onChange: (next: ComposerImage) => void
}

export const ImageAltTextDialog = ({
  control,
  image,
  onChange,
}: Props): React.ReactNode => {
  const {height: minHeight} = useWindowDimensions()
  const [altText, setAltText] = React.useState(image.alt)

  React.useEffect(() => {
    setAltText(image.alt)
  }, [image.alt])

  return (
    <Dialog.Outer
      control={control}
      onClose={() => {
        onChange({
          ...image,
          alt: enforceLen(altText, MAX_ALT_TEXT, true),
        })
      }}
      nativeOptions={{minHeight}}>
      <Dialog.Handle />
      <ImageAltTextInner
        control={control}
        image={image}
        altText={altText}
        setAltText={setAltText}
      />
    </Dialog.Outer>
  )
}

const ImageAltTextInner = ({
  altText,
  setAltText,
  control,
  image,
}: {
  altText: string
  setAltText: (text: string) => void
  control: DialogControlProps
  image: Props['image']
}): React.ReactNode => {
  const {_, i18n} = useLingui()
  const t = useTheme()
  const windim = useWindowDimensions()

  const [isKeyboardVisible] = useIsKeyboardVisible()
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generateError, setGenerateError] = React.useState<string | null>(null)

  const openRouterConfigured = useOpenRouterConfigured()
  const openRouterApiKey = useOpenRouterApiKey()
  const openRouterModel = useOpenRouterModel()

  const imageStyle = React.useMemo<ImageStyle>(() => {
    const maxWidth = IS_WEB ? 450 : windim.width
    const source = image.transformed ?? image.source

    if (source.height > source.width) {
      return {
        resizeMode: 'contain',
        width: '100%',
        aspectRatio: 1,
        borderRadius: 8,
      }
    }
    return {
      width: '100%',
      height: (maxWidth / source.width) * source.height,
      borderRadius: 8,
    }
  }, [image, windim])

  const handleGenerateAltText = React.useCallback(async () => {
    if (!openRouterApiKey) return

    setIsGenerating(true)
    setGenerateError(null)

    try {
      const imagePath = (image.transformed ?? image.source).path

      let base64: string
      let mimeType: string

      if (IS_WEB) {
        const response = await fetch(imagePath)
        const blob = await response.blob()
        mimeType = blob.type || 'image/jpeg'
        const arrayBuffer = await blob.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        let binary = ''
        for (let i = 0; i < uint8Array.length; i++) {
          binary += String.fromCharCode(uint8Array[i])
        }
        base64 = btoa(binary)
      } else {
        const base64Result = await readAsStringAsync(imagePath, {
          encoding: EncodingType.Base64,
        })
        base64 = base64Result
        const pathParts = imagePath.split('.')
        const ext = pathParts[pathParts.length - 1]?.toLowerCase()
        mimeType = ext === 'png' ? 'image/png' : 'image/jpeg'
      }

      const generated = await generateAltText(
        openRouterApiKey,
        openRouterModel ?? DEFAULT_ALT_TEXT_AI_MODEL,
        base64,
        mimeType,
      )

      setAltText(enforceLen(generated, MAX_ALT_TEXT, true))
    } catch (err) {
      setGenerateError(
        err instanceof Error ? err.message : 'Failed to generate alt text',
      )
    } finally {
      setIsGenerating(false)
    }
  }, [openRouterApiKey, openRouterModel, image, setAltText])

  return (
    <Dialog.ScrollableInner label={_(msg`Add alt text`)}>
      <Dialog.Close />

      <View>
        <Text style={[a.text_2xl, a.font_semi_bold, a.leading_tight, a.pb_sm]}>
          <Trans>Add alt text</Trans>
        </Text>

        <View style={[t.atoms.bg_contrast_50, a.rounded_sm, a.overflow_hidden]}>
          <Image
            style={imageStyle}
            source={{uri: (image.transformed ?? image.source).path}}
            contentFit="contain"
            accessible={true}
            accessibilityIgnoresInvertColors
            enableLiveTextInteraction
            autoplay={false}
          />
        </View>
      </View>

      <View style={[a.mt_md, a.gap_md]}>
        <View style={[a.gap_sm]}>
          <View style={[a.relative, {width: '100%'}]}>
            <TextField.LabelText>
              <Trans>Descriptive alt text</Trans>
            </TextField.LabelText>
            <TextField.Root>
              <Dialog.Input
                label={_(msg`Alt text`)}
                onChangeText={text => {
                  setAltText(text)
                }}
                value={altText}
                multiline
                numberOfLines={3}
                autoFocus
              />
            </TextField.Root>
          </View>

          {altText.length > MAX_ALT_TEXT && (
            <View style={[a.pb_sm, a.flex_row, a.gap_xs]}>
              <CircleInfo fill={t.palette.negative_500} />
              <Text
                style={[
                  a.italic,
                  a.leading_snug,
                  t.atoms.text_contrast_medium,
                ]}>
                <Trans>
                  Alt text will be truncated.{' '}
                  <Plural
                    value={MAX_ALT_TEXT}
                    other={`Limit: ${i18n.number(MAX_ALT_TEXT)} characters.`}
                  />
                </Trans>
              </Text>
            </View>
          )}

          {generateError && (
            <View style={[a.pb_sm, a.flex_row, a.gap_xs]}>
              <CircleInfo fill={t.palette.negative_500} />
              <Text style={[t.atoms.text_contrast_medium]}>
                {generateError}
              </Text>
            </View>
          )}
        </View>

        {openRouterConfigured && (
          <Button
            label={_(msg`Generate alt text with AI`)}
            size="large"
            color="secondary"
            variant="solid"
            onPress={handleGenerateAltText}
            disabled={isGenerating}
            style={[a.flex_grow]}>
            {isGenerating ? (
              <ActivityIndicator color={t.palette.primary_500} />
            ) : (
              <SparkleIcon size="sm" />
            )}
            <ButtonText>
              <Trans>Generate Alt Text with AI</Trans>
            </ButtonText>
          </Button>
        )}

        <AltTextCounterWrapper altText={altText}>
          <Button
            label={_(msg`Save`)}
            disabled={altText === image.alt}
            size="large"
            color="primary"
            variant="solid"
            onPress={() => {
              control.close()
            }}
            style={[a.flex_grow]}>
            <ButtonText>
              <Trans>Save</Trans>
            </ButtonText>
          </Button>
        </AltTextCounterWrapper>
      </View>
      {/* Maybe fix this later -h */}
      {IS_ANDROID && isKeyboardVisible ? <View style={{height: 300}} /> : null}
    </Dialog.ScrollableInner>
  )
}
