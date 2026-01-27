import {useState} from 'react'
import {View} from 'react-native'
import {type ProfileViewBasic} from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {usePalette} from '#/lib/hooks/usePalette'
import {type CommonNavigatorParams} from '#/lib/routes/types'
import * as persisted from '#/state/persisted'
import {useGoLinksEnabled, useSetGoLinksEnabled} from '#/state/preferences'
import {
  useConstellationInstance,
  useSetConstellationInstance,
} from '#/state/preferences/constellation-instance'
import {
  useDeerVerificationEnabled,
  useDeerVerificationTrusted,
  useSetDeerVerificationEnabled,
} from '#/state/preferences/deer-verification'
import {
  useDirectFetchRecords,
  useSetDirectFetchRecords,
} from '#/state/preferences/direct-fetch-records'
import {
  useDisableComposerPrompt,
  useSetDisableComposerPrompt,
} from '#/state/preferences/disable-composer-prompt'
import {
  useDisableFollowedByMetrics,
  useSetDisableFollowedByMetrics,
} from '#/state/preferences/disable-followed-by-metrics'
import {
  useDisableFollowersMetrics,
  useSetDisableFollowersMetrics,
} from '#/state/preferences/disable-followers-metrics'
import {
  useDisableFollowingMetrics,
  useSetDisableFollowingMetrics,
} from '#/state/preferences/disable-following-metrics'
import {
  useDisableLikesMetrics,
  useSetDisableLikesMetrics,
} from '#/state/preferences/disable-likes-metrics'
import {
  useDisablePostsMetrics,
  useSetDisablePostsMetrics,
} from '#/state/preferences/disable-posts-metrics'
import {
  useDisableQuotesMetrics,
  useSetDisableQuotesMetrics,
} from '#/state/preferences/disable-quotes-metrics'
import {
  useDisableReplyMetrics,
  useSetDisableReplyMetrics,
} from '#/state/preferences/disable-reply-metrics'
import {
  useDisableRepostsMetrics,
  useSetDisableRepostsMetrics,
} from '#/state/preferences/disable-reposts-metrics'
import {
  useDisableSavesMetrics,
  useSetDisableSavesMetrics,
} from '#/state/preferences/disable-saves-metrics'
import {
  useDisableVerifyEmailReminder,
  useSetDisableVerifyEmailReminder,
} from '#/state/preferences/disable-verify-email-reminder'
import {
  useDisableViaRepostNotification,
  useSetDisableViaRepostNotification,
} from '#/state/preferences/disable-via-repost-notification'
import {
  useSetShowExternalShareButtons,
  useShowExternalShareButtons,
} from '#/state/preferences/external-share-buttons'
import {
  useHideFeedsPromoTab,
  useSetHideFeedsPromoTab,
} from '#/state/preferences/hide-feeds-promo-tab'
import {
  useHideSimilarAccountsRecomm,
  useSetHideSimilarAccountsRecomm,
} from '#/state/preferences/hide-similar-accounts-recommendations'
import {
  useHideUnreplyablePosts,
  useSetHideUnreplyablePosts,
} from '#/state/preferences/hide-unreplyable-posts'
import {
  useHighQualityImages,
  useSetHighQualityImages,
} from '#/state/preferences/high-quality-images'
import {useModerationOpts} from '#/state/preferences/moderation-opts'
import {
  useNoAppLabelers,
  useSetNoAppLabelers,
} from '#/state/preferences/no-app-labelers'
import {
  useNoDiscoverFallback,
  useSetNoDiscoverFallback,
} from '#/state/preferences/no-discover-fallback'
import {
  usePostReplacement,
  useSetPostReplacement,
} from '#/state/preferences/post-name-replacement'
import {
  useRepostCarouselEnabled,
  useSetRepostCarouselEnabled,
} from '#/state/preferences/repost-carousel-enabled'
import {
  useSetShowLinkInHandle,
  useShowLinkInHandle,
} from '#/state/preferences/show-link-in-handle.tsx'
import {
  useLibreTranslateInstance,
  useSetLibreTranslateInstance,
  useSetTranslationServicePreference,
  useTranslationServicePreference,
} from '#/state/preferences/translation-service-preference'
import {useProfilesQuery} from '#/state/queries/profile'
import * as SettingsList from '#/screens/Settings/components/SettingsList'
import {atoms as a, useBreakpoints} from '#/alf'
import {Admonition} from '#/components/Admonition'
import {Button, ButtonText} from '#/components/Button'
import * as Dialog from '#/components/Dialog'
import * as TextField from '#/components/forms/TextField'
import * as Toggle from '#/components/forms/Toggle'
import {Atom_Stroke2_Corner0_Rounded as DeerIcon} from '#/components/icons/Atom'
import {ChainLink_Stroke2_Corner0_Rounded as ChainLinkIcon} from '#/components/icons/ChainLink'
import {Eye_Stroke2_Corner0_Rounded as VisibilityIcon} from '#/components/icons/Eye'
import {Earth_Stroke2_Corner2_Rounded as EarthIcon} from '#/components/icons/Globe'
import {Lab_Stroke2_Corner0_Rounded as _BeakerIcon} from '#/components/icons/Lab'
import {PaintRoller_Stroke2_Corner2_Rounded as PaintRollerIcon} from '#/components/icons/PaintRoller'
import {RaisingHand4Finger_Stroke2_Corner0_Rounded as RaisingHandIcon} from '#/components/icons/RaisingHand'
import {Star_Stroke2_Corner0_Rounded as StarIcon} from '#/components/icons/Star'
import {Verified_Stroke2_Corner2_Rounded as VerifiedIcon} from '#/components/icons/Verified'
import * as Layout from '#/components/Layout'
import {InlineLinkText} from '#/components/Link'
import {Text} from '#/components/Typography'
import {IS_WEB} from '#/env'
import {SearchProfileCard} from '../Search/components/SearchProfileCard'

type Props = NativeStackScreenProps<CommonNavigatorParams>

function ConstellationInstanceDialog({
  control,
}: {
  control: Dialog.DialogControlProps
}) {
  const pal = usePalette('default')
  const {_} = useLingui()

  const constellationInstance = useConstellationInstance()
  const [url, setUrl] = useState(constellationInstance ?? '')
  const setConstellationInstance = useSetConstellationInstance()

  const submit = () => {
    setConstellationInstance(url)
    control.close()
  }

  const shouldDisable = () => {
    try {
      return !new URL(url).hostname.includes('.')
    } catch (e) {
      return true
    }
  }

  return (
    <Dialog.Outer
      control={control}
      nativeOptions={{preventExpansion: true}}
      onClose={() => setUrl(constellationInstance ?? '')}>
      <Dialog.Handle />
      <Dialog.ScrollableInner label={_(msg`Constellations instance URL`)}>
        <View style={[a.gap_sm, a.pb_lg]}>
          <Text style={[a.text_2xl, a.font_bold]}>
            <Trans>Constellations instance URL</Trans>
          </Text>
        </View>

        <View style={a.gap_lg}>
          <Dialog.Input
            label="Text input field"
            autoFocus
            style={[styles.textInput, pal.border, pal.text]}
            onChangeText={value => {
              setUrl(value)
            }}
            placeholder={persisted.defaults.constellationInstance}
            placeholderTextColor={pal.colors.textLight}
            onSubmitEditing={submit}
            accessibilityHint={_(
              msg`Input the url of the constellations instance to use`,
            )}
            defaultValue={constellationInstance}
          />

          <View style={IS_WEB && [a.flex_row, a.justify_end]}>
            <Button
              label={_(msg`Save`)}
              size="large"
              onPress={submit}
              variant="solid"
              color="primary"
              disabled={shouldDisable()}>
              <ButtonText>
                <Trans>Save</Trans>
              </ButtonText>
            </Button>
          </View>
        </View>

        <Dialog.Close />
      </Dialog.ScrollableInner>
    </Dialog.Outer>
  )
}

function LibreTranslateInstanceDialog({
  control,
}: {
  control: Dialog.DialogControlProps
}) {
  const pal = usePalette('default')
  const {_} = useLingui()

  const libreTranslateInstance = useLibreTranslateInstance()
  const [url, setUrl] = useState(libreTranslateInstance ?? '')
  const setLibreTranslateInstance = useSetLibreTranslateInstance()

  const submit = () => {
    setLibreTranslateInstance(url)
    control.close()
  }

  const shouldDisable = () => {
    try {
      return !new URL(url).hostname.includes('.')
    } catch (e) {
      return true
    }
  }

  return (
    <Dialog.Outer
      control={control}
      nativeOptions={{preventExpansion: true}}
      onClose={() => setUrl(libreTranslateInstance ?? '')}>
      <Dialog.Handle />
      <Dialog.ScrollableInner label={_(msg`LibreTranslate instance URL`)}>
        <View style={[a.gap_sm, a.pb_lg]}>
          <Text style={[a.text_2xl, a.font_bold]}>
            <Trans>LibreTranslate instance URL</Trans>
          </Text>
        </View>

        <View style={a.gap_lg}>
          <Dialog.Input
            label="Text input field"
            autoFocus
            style={[styles.textInput, pal.border, pal.text]}
            onChangeText={value => {
              setUrl(value)
            }}
            placeholder={persisted.defaults.libreTranslateInstance}
            placeholderTextColor={pal.colors.textLight}
            onSubmitEditing={submit}
            accessibilityHint={_(
              msg`Input the url of the LibreTranslate instance to use`,
            )}
            defaultValue={libreTranslateInstance}
          />

          <View style={IS_WEB && [a.flex_row, a.justify_end]}>
            <Button
              label={_(msg`Save`)}
              size="large"
              onPress={submit}
              variant="solid"
              color="primary"
              disabled={shouldDisable()}>
              <ButtonText>
                <Trans>Save</Trans>
              </ButtonText>
            </Button>
          </View>
        </View>

        <Dialog.Close />
      </Dialog.ScrollableInner>
    </Dialog.Outer>
  )
}

function TrustedVerifiersDialog({
  control,
}: {
  control: Dialog.DialogControlProps
}) {
  const {_} = useLingui()

  return (
    <Dialog.Outer control={control} nativeOptions={{preventExpansion: true}}>
      <Dialog.Handle />
      <Dialog.ScrollableInner label={_(msg`Trusted Verifiers`)}>
        <View style={[a.gap_sm, a.pb_lg]}>
          <Text style={[a.text_2xl, a.font_bold]}>
            <Trans>Trusted Verifiers</Trans>
          </Text>
        </View>

        <TrustedVerifiers />

        <Dialog.Close />
      </Dialog.ScrollableInner>
    </Dialog.Outer>
  )
}

const TrustedVerifiers = (): React.ReactNode => {
  const trusted = useDeerVerificationTrusted()
  const moderationOpts = useModerationOpts()

  const results = useProfilesQuery({
    handles: Array.from(trusted),
  })

  const {gtMobile} = useBreakpoints()

  return (
    results.data &&
    moderationOpts !== undefined && (
      <View style={[gtMobile ? a.pl_md : a.pl_sm, a.pb_sm]}>
        {results.data.profiles.map(profile => (
          <SearchProfileCard
            key={profile.did}
            profile={profile as ProfileViewBasic}
            moderationOpts={moderationOpts}
          />
        ))}
      </View>
    )
  )
}

export function DeerSettingsScreen({}: Props) {
  const {_} = useLingui()

  const goLinksEnabled = useGoLinksEnabled()
  const setGoLinksEnabled = useSetGoLinksEnabled()

  const directFetchRecords = useDirectFetchRecords()
  const setDirectFetchRecords = useSetDirectFetchRecords()

  const showExternalShareButtons = useShowExternalShareButtons()
  const setShowExternalShareButtons = useSetShowExternalShareButtons()

  const noAppLabelers = useNoAppLabelers()
  const setNoAppLabelers = useSetNoAppLabelers()

  const noDiscoverFallback = useNoDiscoverFallback()
  const setNoDiscoverFallback = useSetNoDiscoverFallback()

  const highQualityImages = useHighQualityImages()
  const setHighQualityImages = useSetHighQualityImages()

  const hideFeedsPromoTab = useHideFeedsPromoTab()
  const setHideFeedsPromoTab = useSetHideFeedsPromoTab()

  const disableViaRepostNotification = useDisableViaRepostNotification()
  const setDisableViaRepostNotification = useSetDisableViaRepostNotification()

  const disableComposerPrompt = useDisableComposerPrompt()
  const setDisableComposerPrompt = useSetDisableComposerPrompt()

  const disableLikesMetrics = useDisableLikesMetrics()
  const setDisableLikesMetrics = useSetDisableLikesMetrics()

  const disableRepostsMetrics = useDisableRepostsMetrics()
  const setDisableRepostsMetrics = useSetDisableRepostsMetrics()

  const disableQuotesMetrics = useDisableQuotesMetrics()
  const setDisableQuotesMetrics = useSetDisableQuotesMetrics()

  const disableSavesMetrics = useDisableSavesMetrics()
  const setDisableSavesMetrics = useSetDisableSavesMetrics()

  const disableReplyMetrics = useDisableReplyMetrics()
  const setDisableReplyMetrics = useSetDisableReplyMetrics()

  const disableFollowersMetrics = useDisableFollowersMetrics()
  const setDisableFollowersMetrics = useSetDisableFollowersMetrics()

  const disableFollowingMetrics = useDisableFollowingMetrics()
  const setDisableFollowingMetrics = useSetDisableFollowingMetrics()

  const disableFollowedByMetrics = useDisableFollowedByMetrics()
  const setDisableFollowedByMetrics = useSetDisableFollowedByMetrics()

  const disablePostsMetrics = useDisablePostsMetrics()
  const setDisablePostsMetrics = useSetDisablePostsMetrics()

  const hideSimilarAccountsRecomm = useHideSimilarAccountsRecomm()
  const setHideSimilarAccountsRecomm = useSetHideSimilarAccountsRecomm()

  const hideUnreplyablePosts = useHideUnreplyablePosts()
  const setHideUnreplyablePosts = useSetHideUnreplyablePosts()

  const disableVerifyEmailReminder = useDisableVerifyEmailReminder()
  const setDisableVerifyEmailReminder = useSetDisableVerifyEmailReminder()

  const constellationInstance = useConstellationInstance()
  const setConstellationInstanceControl = Dialog.useDialogControl()

  const setTrustedVerifiersDialogControl = Dialog.useDialogControl()

  const deerVerificationEnabled = useDeerVerificationEnabled()
  const setDeerVerificationEnabled = useSetDeerVerificationEnabled()

  const repostCarouselEnabled = useRepostCarouselEnabled()
  const setRepostCarouselEnabled = useSetRepostCarouselEnabled()

  const showLinkInHandle = useShowLinkInHandle()
  const setShowLinkInHandle = useSetShowLinkInHandle()

  const translationServicePreference = useTranslationServicePreference()
  const setTranslationServicePreference = useSetTranslationServicePreference()

  const setLibreTranslateInstanceControl = Dialog.useDialogControl()

  const postReplacement = usePostReplacement()
  const setPostReplacement = useSetPostReplacement()

  return (
    <Layout.Screen>
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          <Layout.Header.TitleText>
            <Trans>Experiments</Trans>
          </Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content>
        <SettingsList.Container>
          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={DeerIcon} />
            <SettingsList.ItemText>
              <Trans>Redirects</Trans>
            </SettingsList.ItemText>
            <Toggle.Item
              name="use_go_links"
              label={_(msg`Redirect through go.bsky.app`)}
              value={goLinksEnabled ?? false}
              onChange={value => setGoLinksEnabled(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Redirect through go.bsky.app</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
          </SettingsList.Group>

          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={VisibilityIcon} />
            <SettingsList.ItemText>
              <Trans>Visibility</Trans>
            </SettingsList.ItemText>
            <Toggle.Item
              name="direct_fetch_records"
              label={_(
                msg`Fetch records directly from PDS to see through quote blocks`,
              )}
              value={directFetchRecords}
              onChange={value => setDirectFetchRecords(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>
                  Fetch records directly from PDS to see contents of blocked and
                  detached quotes
                </Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
          </SettingsList.Group>

          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={ChainLinkIcon} />
            <SettingsList.ItemText>
              <Trans>Bridging and Fediverse</Trans>
            </SettingsList.ItemText>
            <Toggle.Item
              name="external_share_buttons"
              label={_(
                msg`Show "Open original post" and "Open post in PDSls" buttons`,
              )}
              value={showExternalShareButtons}
              onChange={value => setShowExternalShareButtons(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>
                  Show "Open original post" and "Open post in PDSls" buttons
                </Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
          </SettingsList.Group>

          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={VerifiedIcon} />
            <SettingsList.ItemText>
              <Trans>Verification</Trans>
            </SettingsList.ItemText>
            <Toggle.Item
              name="custom_verifications"
              label={_(
                msg`Select your own set of trusted verifiers, and operate as a verifier`,
              )}
              value={deerVerificationEnabled}
              onChange={value => setDeerVerificationEnabled(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>
                  Select your own set of trusted verifiers, and operate as a
                  verifier
                </Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
          </SettingsList.Group>

          <SettingsList.Item>
            <Admonition type="warning" style={[a.flex_1]}>
              <Trans>
                May slow down the client or fail to find all labels. Revoke and
                grant trust in the meatball menu on a profile.{' '}
                {deerVerificationEnabled
                  ? 'You currently'
                  : 'If enabled, you would'}{' '}
                trust the following verifiers:
              </Trans>
            </Admonition>
          </SettingsList.Item>

          <SettingsList.Item>
            <SettingsList.ItemIcon icon={VerifiedIcon} />
            <SettingsList.ItemText>
              <Trans>{`Trusted Verifiers`}</Trans>
            </SettingsList.ItemText>
            <SettingsList.BadgeButton
              label={_(msg`View`)}
              onPress={() => setTrustedVerifiersDialogControl.open()}
            />
          </SettingsList.Item>

          <SettingsList.Item>
            <SettingsList.ItemIcon icon={StarIcon} />
            <SettingsList.ItemText>
              <Trans>{`Constellation Instance`}</Trans>
            </SettingsList.ItemText>
            <SettingsList.BadgeButton
              label={_(msg`Change`)}
              onPress={() => setConstellationInstanceControl.open()}
            />
          </SettingsList.Item>
          <SettingsList.Item>
            <Admonition type="info" style={[a.flex_1]}>
              <Trans>
                Constellation is used to supplement AppView responses for custom
                verifications and nuclear block bypass, via backlinks. Current
                instance:
                <InlineLinkText
                  to={constellationInstance}
                  label={constellationInstance}>
                  {constellationInstance}
                </InlineLinkText>
              </Trans>
            </Admonition>
          </SettingsList.Item>

          <SettingsList.Divider />

          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={VerifiedIcon} />
            <SettingsList.ItemText>
              <Trans>
                Call posts{' '}
                {postReplacement.string.length
                  ? postReplacement.string.toLowerCase()
                  : 'skeet'}
                s
              </Trans>
            </SettingsList.ItemText>
            <Toggle.Item
              name="call_posts_skeets"
              label={_(
                msg`Changes post to another word of your choosing. Requires a refresh to update.`,
              )}
              value={postReplacement.enabled}
              onChange={value =>
                setPostReplacement({
                  enabled: value,
                  string: postReplacement.string,
                })
              }
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>
                  Changes post to another word of your choosing. Requires a
                  refresh to update.
                </Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>

            {postReplacement.enabled && (
              <SettingsList.Item>
                <TextField.Root>
                  <TextField.Input
                    label={_(msg`Custom post name`)}
                    value={postReplacement.string}
                    onChangeText={(value: string) =>
                      setPostReplacement(
                        (curr: {enabled: boolean; string: string}) => ({
                          ...curr,
                          string: value,
                        }),
                      )
                    }
                  />
                </TextField.Root>
              </SettingsList.Item>
            )}
          </SettingsList.Group>

          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={PaintRollerIcon} />
            <SettingsList.ItemText>
              <Trans>Tweaks</Trans>
            </SettingsList.ItemText>
            <Toggle.Item
              name="repost_carousel"
              label={_(msg`Combine reposts into a horizontal carousel`)}
              value={repostCarouselEnabled}
              onChange={value => setRepostCarouselEnabled(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Combine reposts into a horizontal carousel</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
            <Toggle.Item
              name="no_discover_fallback"
              label={_(msg`Do not fall back to discover feed`)}
              value={noDiscoverFallback}
              onChange={value => setNoDiscoverFallback(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Do not fall back to discover feed</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
            <Toggle.Item
              name="show_link_in_handle"
              label={_(
                msg`On non-bsky.social handles, show a link to that URL`,
              )}
              value={showLinkInHandle}
              onChange={value => setShowLinkInHandle(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>
                  On non-bsky.social handles, show a link to that URL
                </Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>

            <Toggle.Item
              name="repost_carousel"
              label={_(msg`Combine reposts into a horizontal carousel`)}
              value={repostCarouselEnabled}
              onChange={value => setRepostCarouselEnabled(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Combine reposts into a horizontal carousel</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>

            <Toggle.Item
              name="no_discover_fallback"
              label={_(msg`Do not fall back to discover feed`)}
              value={noDiscoverFallback}
              onChange={value => setNoDiscoverFallback(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Do not fall back to discover feed</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>

            <Toggle.Item
              name="high_quality_images"
              label={_(msg`Display images in higher quality`)}
              value={highQualityImages}
              onChange={value => setHighQualityImages(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Display images in higher quality</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
            <Admonition type="info" style={[a.flex_1]}>
              <Trans>
                Images will be served as PNG instead of JPEG. Images will take
                longer to load and use more bandwidth.
              </Trans>
            </Admonition>

            <Toggle.Item
              name="hide_feeds_promo_tab"
              label={_(msg`Hide "Feeds ✨" tab when only one feed is selected`)}
              value={hideFeedsPromoTab}
              onChange={value => setHideFeedsPromoTab(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>
                  Hide "Feeds ✨" tab when only one feed is selected
                </Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>

            <Toggle.Item
              name="disable_via_repost_notification"
              label={_(msg`Disable via repost notifications`)}
              value={disableViaRepostNotification}
              onChange={value => setDisableViaRepostNotification(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Disable via repost notifications</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
            <Admonition type="info" style={[a.flex_1]}>
              <Trans>
                Forcefully disables the notifications other people receive when
                you like/repost a post someone else has reposted for privacy.
              </Trans>
            </Admonition>

            <Toggle.Item
              name="hide_similar_accounts_recommendations"
              label={_(msg`Hide similar accounts recommendations`)}
              value={hideSimilarAccountsRecomm}
              onChange={value => setHideSimilarAccountsRecomm(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Hide similar accounts recommendations</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>

            <Toggle.Item
              name="hide_unreplyable_posts"
              label={_(msg`Hide posts that cannot be replied to from feeds`)}
              value={hideUnreplyablePosts}
              onChange={value => setHideUnreplyablePosts(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Hide posts that cannot be replied to from feeds</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
            <Admonition type="info" style={[a.flex_1]}>
              <Trans>
                Hides posts from feeds where replies are disabled (e.g. due to
                postgates or other restrictions). Does not affect thread views.
              </Trans>
            </Admonition>

            <Toggle.Item
              name="disable_composer_prompt"
              label={_(msg`Disable composer prompt`)}
              value={disableComposerPrompt}
              onChange={value => setDisableComposerPrompt(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Disable composer prompt</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>

            <Toggle.Item
              name="disable_verify_email_reminder"
              label={_(msg`Disable verify email reminder`)}
              value={disableVerifyEmailReminder}
              onChange={value => setDisableVerifyEmailReminder(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Disable verify email reminder</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
            <Admonition type="warning" style={[a.flex_1]}>
              <Trans>
                This only gets rid of the reminder on app launch, useful if your
                PDS does not have email verification setup.\nThis does NOT give
                access to features locked behind email verification.
              </Trans>
            </Admonition>
          </SettingsList.Group>

          <SettingsList.Divider />

          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={EarthIcon} />
            <SettingsList.ItemText>
              <Trans>Post Translation Engine</Trans>
            </SettingsList.ItemText>

            <Toggle.Item
              name="service_google"
              label={_(msg`Use Google Translate`)}
              value={translationServicePreference === 'google'}
              onChange={() => setTranslationServicePreference('google')}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Use Google Translate</Trans>
              </Toggle.LabelText>
              <Toggle.Radio />
            </Toggle.Item>

            <Toggle.Item
              name="service_kagi"
              label={_(msg`Use Kagi Translate`)}
              value={translationServicePreference === 'kagi'}
              onChange={() => setTranslationServicePreference('kagi')}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Use Kagi Translate</Trans>
              </Toggle.LabelText>
              <Toggle.Radio />
            </Toggle.Item>

            <Toggle.Item
              name="service_papago"
              label={_(msg`Use Naver Papago`)}
              value={translationServicePreference === 'papago'}
              onChange={() => setTranslationServicePreference('papago')}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Use Naver Papago</Trans>
              </Toggle.LabelText>
              <Toggle.Radio />
            </Toggle.Item>

            <Toggle.Item
              name="service_libreTranslate"
              label={_(msg`Use LibreTranslate`)}
              value={translationServicePreference === 'libreTranslate'}
              onChange={() => setTranslationServicePreference('libreTranslate')}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Use LibreTranslate</Trans>
              </Toggle.LabelText>
              <Toggle.Radio />
            </Toggle.Item>
          </SettingsList.Group>

          {translationServicePreference === 'libreTranslate' && (
            <SettingsList.Item>
              <SettingsList.ItemIcon icon={EarthIcon} />
              <SettingsList.ItemText>
                <Trans>{`LibreTranslate Instance`}</Trans>
              </SettingsList.ItemText>
              <SettingsList.BadgeButton
                label={_(msg`Change`)}
                onPress={() => setLibreTranslateInstanceControl.open()}
              />
            </SettingsList.Item>
          )}

          <SettingsList.Divider />

          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={VisibilityIcon} />
            <SettingsList.ItemText>
              <Trans>Metrics</Trans>
            </SettingsList.ItemText>

            <Toggle.Item
              name="disable_likes_metrics"
              label={_(msg`Disable likes metrics`)}
              value={disableLikesMetrics}
              onChange={value => setDisableLikesMetrics(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Disable likes metrics</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>

            <Toggle.Item
              name="disable_reposts_metrics"
              label={_(msg`Disable Reposts Metrics`)}
              value={disableRepostsMetrics}
              onChange={value => setDisableRepostsMetrics(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Disable Reposts Metrics</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>

            <Toggle.Item
              name="disable_quotes_metrics"
              label={_(msg`Disable quotes metrics`)}
              value={disableQuotesMetrics}
              onChange={value => setDisableQuotesMetrics(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Disable quotes metrics</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>

            <Toggle.Item
              name="disable_saves_metrics"
              label={_(msg`Disable saves metrics`)}
              value={disableSavesMetrics}
              onChange={value => setDisableSavesMetrics(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Disable saves metrics</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>

            <Toggle.Item
              name="disable_reply_metrics"
              label={_(msg`Disable reply metrics`)}
              value={disableReplyMetrics}
              onChange={value => setDisableReplyMetrics(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Disable reply metrics</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>

            <Toggle.Item
              name="disable_followers_metrics"
              label={_(msg`Disable followers metrics`)}
              value={disableFollowersMetrics}
              onChange={value => setDisableFollowersMetrics(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Disable followers metrics</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>

            <Toggle.Item
              name="disable_following_metrics"
              label={_(msg`Disable following metrics`)}
              value={disableFollowingMetrics}
              onChange={value => setDisableFollowingMetrics(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Disable following metrics</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>

            <Toggle.Item
              name="disable_followed_by_metrics"
              label={_(msg`Disable "followed by" metrics`)}
              value={disableFollowedByMetrics}
              onChange={value => setDisableFollowedByMetrics(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Disable "followed by" metrics</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>

            <Toggle.Item
              name="disable_posts_metrics"
              label={_(msg`Disable posts metrics`)}
              value={disablePostsMetrics}
              onChange={value => setDisablePostsMetrics(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Disable posts metrics</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
          </SettingsList.Group>

          <SettingsList.Divider />

          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={RaisingHandIcon} />
            <SettingsList.ItemText>
              <Trans>Labelers</Trans>
            </SettingsList.ItemText>
            <Toggle.Item
              name="no_app_labelers"
              label={_(msg`Do not declare any app labelers`)}
              value={noAppLabelers}
              onChange={value => setNoAppLabelers(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Do not declare any default app labelers</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
          </SettingsList.Group>

          <SettingsList.Item>
            <Admonition type="warning" style={[a.flex_1]}>
              <Trans>Restart the app after changing this setting.</Trans>
            </Admonition>
          </SettingsList.Item>
          <SettingsList.Item>
            <Admonition type="tip" style={[a.flex_1]}>
              <Trans>
                Some App Views will default to using an app labeler if you have
                no labelers, so consider subscribing to at least one labeler if
                you have issues.
              </Trans>
            </Admonition>
          </SettingsList.Item>
          <SettingsList.Item>
            <Admonition type="info" style={[a.flex_1]}>
              <Trans>
                App labelers are mandatory top-level labelers that can perform
                "takedowns". This setting does not influence geolocation-based
                labelers.
              </Trans>
            </Admonition>
          </SettingsList.Item>
        </SettingsList.Container>
      </Layout.Content>
      <ConstellationInstanceDialog control={setConstellationInstanceControl} />
      <TrustedVerifiersDialog control={setTrustedVerifiersDialogControl} />
      <LibreTranslateInstanceDialog
        control={setLibreTranslateInstanceControl}
      />
    </Layout.Screen>
  )
}

const styles = {
  textInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
}
