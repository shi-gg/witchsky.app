# Witchsky Social App 🧙 (alpha)

Hey, witches! This is the codebase for the Witchsky app, based on [social.daniela.lol](https://github.com/kittibytess/deer-social) and prior [Bluesky](https://github.com/bluesky-social/social-app) forks.

Get the app itself:

- **Web: [witchsky.app](https://witchsky.app)**
- **iOS: App Store [Soon™](https://cat-bounce.com/)?**
- **Android: Play Store Soon! ([F-Droid repo](https://app.jolly.you/fdroid/repo)?)**

<!-- <a href="https://apps.obtainium.imranr.dev/redirect?r=obtainium://add/https://tangled.org/jollywhoppers.com/witchsky.app/">
<img src="https://github.com/ImranR98/Obtainium/blob/main/assets/graphics/badge_obtainium.png?raw=true"
alt="Get it on Obtainium" height="54" /></a> -->

## Improvements on Bluesky

- Cooler name (and kawaii logo)
- Color scheme options and hue slider (defaults to Witchsky orange)
- You can change 
- Choose between sharing witchsky.app or bsky.app links
- Embed player works with [stream.place](https://stream.place/) links!
- Open posts in PDSls and original pages of bridged posts
- You can redraft posts
- Better defaults (alt text required 😉 autoplay off 🫨)
- More unique repost icons
- Can download videos
- 'Mutuals' in place of 'Following' when relevant
- No push notifications (hopefully will be added later)
- Kept as up-to-date as possible (sporadically unstable as a result)

### Experiments

These are all available as options in a sub-page of the app's settings.

- Toggle go.bsky.app link proxying for analytics
- Toggle to see posts in quotes through blocks and detachments
- Toggle for buttons to show original fedi posts and in PDSls
- Toggle to trust your own preferred verifiers (and to operate as one yourself)
- Toggle to change Constellation instance for custom features
- Toggle to disable the default app labeler(s)

#### Tweaks

- Toggle to turn non-bsky.social handles into clickable links
- Toggle to combine reposts in horizontal carousels
- Toggle the following feed fallback to the discover feed
- Toggle displaying images in higher quality
- Toggle to only show a single tab if only one feed is pinned
- Toggle to prevent others from getting notified when you interact with their reposts
- Toggle similar account recommendations
- Toggle to make all user avatars square (like labelers)
- Toggle for more square-ish UI (still slightly rounded)
- Toggle to remove the composer prompt at the top of the Following & Discover feeds
- Change post translation provider (between Google, Kagi, Papago, and LibreTranslate)

#### Metrics

You can completely disable the visiblity of all metrics individually, including the number of:

- likes
- reposts
- quotes
- saves
- replies
- followers
- following
- & who someone's followed by

## Upcoming or wishful features

- Better OpenGraph support for sharing profiles & posts (including videos & fixing quotes)
- Selecting a custom AppView
- Seeing past blocks in threads (the nuclear block in reply chains)
- Configure the location used to determine regional labelers

### TODO: Xan

- [ ] Setup App Linking for Android (.well-known w/ app package fingerprint)
- [ ] Fallback/email addresses to use witchsky.social in Automatic PDS detection
- [ ] Change followed accounts [on onboarding](https://github.com/blacksky-algorithms/blacksky.community/commit/e36ee43efb4999f070860d7f70122e45b28c1e2b)
- [ ] Join date & switch accounts in composer from a fork like [deer.aylac.top](https://github.com/ayla6/deer-social-test)
- [ ] Visual replies indicator like the [Firmament userstyle](https://witchsky.app/profile/did:plc:jwhxcrf5uvl3vyw7nurecgt5/post/3m4rr3vzmak2a) (and likes?)
- [ ] Put DeerSettings into separate subpages
- [ ] After subpages for options, add [Outlinks page](https://witchsky.app/profile/did:plc:q7suwaz53ztc4mbiqyygbn43/post/3m5zjhhshic2g) &
  - [ ] ShareMenuItems.tsx, ShareMenuItems.web.tsx
- [ ] For profile meatball button, Open profile in PDSls & Open bridged OG fedi account page
  - [ ] ProfileMenu.tsx
- [ ] Witchsky PDS and .social site (list good songs containing 'bitch' in their titles for related site)

### Even more wishful or far off

- [ ] Collapse labels past a customizable number (from the same labeler?) into a labeler clip "(+)"
- [ ] Submit releases to the Google Play Store and iOS App Store
- [ ] Move from [Cloudflare Pages](https://pages.cloudflare.com/) to [wisp.place](https://wisp.place/) (needs serverless for embeds)
- [ ] Toggle between handle and DID in share links
- [ ] Move TOS and privacy policy to Jollywhoppers website
- [ ] Ignore `!no-unauthenticated` labels
- [ ] Material 3 Expressive theming on Android (Liquid **ass on iOS)

## Development Resources

This is a [React Native](https://reactnative.dev/) application, written in the TypeScript programming language. It builds on the `atproto` TypeScript packages (like [`@atproto/api`](https://www.npmjs.com/package/@atproto/api)), which are also open source, but in [a different git repository](https://github.com/bluesky-social/atproto).

There is vestigial Go language source code (in `./bskyweb/`), for a web service that returns the React Native Web application in the social app deployment. However, it is not used in current Witchsky deployments.
For Witchsky, the intended deployment is with a webserver that can serve static files, and reroute to `index.html` as needed. [Witchsky](https://witchsky.app) is currently hosted on [Cloudflare Pages](https://pages.cloudflare.com/).

The [Build Instructions](./docs/build.md) are a good place to get started with the app itself. If you use nix (and especially direnv) then `flake.nix` will get you a working environment for the web version of the app.

The Authenticated Transfer Protocol ("AT Protocol" or "atproto") is a decentralized social media protocol. You don't *need* to understand AT Protocol to work with this application, but it can help.
You may wish to reference [resources linked in social-app](https://github.com/bluesky-social/social-app#development-resources). However, please don't harass the Bluesky team with issues or questions pertaining to Witchsky.

Witchsky is a fork of the official Bluesky client, social-app. It encompasses a set of schemas and APIs built in the overall AT Protocol framework. The namespace for these "Lexicons" is `app.bsky.*`.

## Contributions

> Witchsky is a community fork, and we'd love to merge your PR!

As a rule of thumb, the best features for Witchsky are those that have a disproportionately positive impact on the user experience compared to the maintenance overhead. Unlike some open source projects, since Witchsky is a soft fork, any features (patches) we add on top of upstream social-app need to be maintained. For example, a change to the way posts are composed may be very invasive, touching lots of code across the codebase. If upstream refactors this component, we will need to rewrite this feature to be compatible or drop it from the client.

For this reason, only features that require changing only a small amount of code from upstream should be considered.

Without an overriding motivation, opinionated features should exist behind a toggle that is not enabled by default. This allows Witchsky to cater to as many users as possible.

### Guidelines

- Check for existing issues before filing a new one please.
- Open an issue and give some time for discussion before submitting a PR.
  - This isn't strictly necessary, but the lead developers would love to give their thoughts and scope out your willingness to maintain the feature before you write it.
- Stay away from PRs like...
  - Changing "Quote" to "Bitch."
  - Refactoring the codebase, e.g., to replace React Query with Redux Toolkit, etc.
- Include a new toggle and preference for your feature.

If we don't merge your PR for whatever reason, you are welcome to fork and/or self-host:

## Forking guidelines

Just like social-app, you have our blessing 🪄✨ to fork this application! However, it's very important to make it clear to users when you're giving them a fork.

Please be sure to:

- Change all branding in the repository and UI to clearly differentiate from Witchsky.
- Change any support links (feedback, email, terms of service, issue tracker, etc) to your own systems.

## Self hosting & personal builds

Self hosting is great! It is our intention that Witchsky is easy to self host and build on your own. If you host your own instance of Witchsky, or make your own builds, please make some level of effort to clarify that it is not an "official" build or instance. This can be in the form of a different domain or branding, but can also be as simple as not advertising your hosted instance or builds as "official" releases.

## Security disclosures

If you discover any security issues, please privately disclose them to [xan.lol](https://xan.lol/).
If the issue pertains to infastructure, code, or systems outside the scope of Witchsky, please refer to the [disclosure guidelines on social-app](https://github.com/bluesky-social/social-app#security-disclosures) if it is hosted by Bluesky PBC. Otherwise, reference the security policy of that system as applicable <3

## License (MIT)

See [./LICENSE](./LICENSE) for the full license.

Bluesky Social PBC has committed to a software patent non-aggression pledge. For details see [the original announcement](https://bsky.social/about/blog/10-01-2025-patent-pledge).

## P.S.

We ❤️ you and all of the ways you support us. Thank you for making Bluesky & Witchsky so great! ^.^
