import {DEFAULT_ALT_TEXT_AI_MODEL, MAX_ALT_TEXT} from '#/lib/constants'
import {logger} from '#/logger'

export async function generateAltText(
  apiKey: string,
  model: string,
  imageBase64: string,
  imageMimeType: string,
): Promise<string> {
  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://witchsky.app',
        'X-Title': 'Witchsky',
      },
      body: JSON.stringify({
        model: model || DEFAULT_ALT_TEXT_AI_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Generate a concise, descriptive alt text for this image, also extract text if needed. The alt text should be clear and helpful for screen readers. Keep it under ${MAX_ALT_TEXT} characters. Only respond with the alt text itself, no explanations or quotes.`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${imageMimeType};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: MAX_ALT_TEXT,
      }),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    logger.error('OpenRouter API error', {
      status: response.status,
      error: errorText,
    })
    throw new Error(`OpenRouter API error: ${response.status}`)
  }

  const data = await response.json()
  const altText = data.choices?.[0]?.message?.content?.trim()

  if (!altText) {
    throw new Error('No alt text generated')
  }

  return altText
}
