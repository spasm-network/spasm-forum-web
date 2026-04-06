import {SpasmEventV2} from '@/helpers/interfaces'
import {marked} from 'marked'
import { spasm } from 'spasm.js'
import {useAppConfigStore} from './../stores/useAppConfigStore'

export const useUtilsEnv = () => {
  const standardizeTextForDisplay = (
    original: string,
    type: "post" | "reply"
  ): string => {
    const env = useAppConfigStore()?.getAppConfig
    if (!original || typeof(original) !== "string") return ''
    if (!type) return ''
    if (type !== "post" && type !== "reply") return ''

    // Replace &gt; with '>' to make sure that blockquote is
    // properly displayed, but don't replace '<' because it can
    // start a potentially malicious HTML tag.
    // const text = original.replace(/\n&gt; /g, '> ')
    let text = original.replace(/&gt; /g, '> ')

    const enableMarkdownInPosts: boolean =
      env?.enableMarkdownInPosts
    const enableMarkdownInComments: boolean =
      env?.enableMarkdownInComments

    // Images
    const enableEmbedImageTagsForAllUsers: boolean =
      env?.enableEmbedImageTagsForAllUsers
    const enableEmbedImageTagsForFullLineImageLinks: boolean =
      env?.enableEmbedImageTagsForFullLineImageLinks
    const enableEmbedImageTagsInPosts: boolean =
      env?.enableEmbedImageTagsInPosts
    const enableEmbedImageTagsInComments: boolean =
      env?.enableEmbedImageTagsInComments

    if (
      enableEmbedImageTagsForAllUsers &&
      enableEmbedImageTagsForFullLineImageLinks
    ) {
      // Also checking whether markdown is enabled before
      // adding img tags, because otherwise text is displayed
      // without properly rendering HTML tags.
      if (
        enableEmbedImageTagsInPosts && type === "post" &&
        enableMarkdownInPosts
      ) {
        text = wrapFullLineImageLinksWithImgTags(text)
      }
      if (
        enableEmbedImageTagsInComments && type === "reply" &&
        enableMarkdownInComments
      ) {
        text = wrapFullLineImageLinksWithImgTags(text)
      }
    }

    // Videos
    const enableEmbedVideoTagsForAllUsers: boolean =
      env?.enableEmbedVideoTagsForAllUsers
    const enableEmbedVideoTagsForFullLineVideoLinks: boolean =
      env?.enableEmbedVideoTagsForFullLineVideoLinks
    const enableEmbedVideoTagsInPosts: boolean =
      env?.enableEmbedVideoTagsInPosts
    const enableEmbedVideoTagsInComments: boolean =
      env?.enableEmbedVideoTagsInComments

    if (
      enableEmbedVideoTagsForAllUsers &&
      enableEmbedVideoTagsForFullLineVideoLinks
    ) {
      // Also checking whether markdown is enabled before
      // adding video tags, because otherwise text is displayed
      // without properly rendering HTML tags.
      if (
        enableEmbedVideoTagsInPosts && type === "post" &&
        enableMarkdownInPosts
      ) {
        text = wrapFullLineVideoLinksWithVideoTags(text)
      }
      if (
        enableEmbedVideoTagsInComments && type === "reply" &&
        enableMarkdownInComments
      ) {
        text = wrapFullLineVideoLinksWithVideoTags(text)
      }
    }

    // Audio
    const enableEmbedAudioTagsForAllUsers: boolean =
      env?.enableEmbedAudioTagsForAllUsers
    const enableEmbedAudioTagsForFullLineAudioLinks: boolean =
      env?.enableEmbedAudioTagsForFullLineAudioLinks
    const enableEmbedAudioTagsInPosts: boolean =
      env?.enableEmbedAudioTagsInPosts
    const enableEmbedAudioTagsInComments: boolean =
      env?.enableEmbedAudioTagsInComments

    if (
      enableEmbedAudioTagsForAllUsers &&
      enableEmbedAudioTagsForFullLineAudioLinks
    ) {
      // Also checking whether markdown is enabled before
      // adding audio tags, because otherwise text is displayed
      // without properly rendering HTML tags.
      if (
        enableEmbedAudioTagsInPosts && type === "post" &&
        enableMarkdownInPosts
      ) {
        text = wrapFullLineAudioLinksWithAudioTags(text)
      }
      if (
        enableEmbedAudioTagsInComments && type === "reply" &&
        enableMarkdownInComments
      ) {
        text = wrapFullLineAudioLinksWithAudioTags(text)
      }
    }

    if (type === "post" && enableMarkdownInPosts) {
      text = marked(text, {breaks:true})
    }

    if (type === "reply" && enableMarkdownInComments) {
      text = marked(text, {breaks:true})
    }

    return text
  }

  const wrapFullLineImageLinksWithImgTags = (
    text: string
  ) => {
    if (typeof(text) !== "string") return ''
    const allowedProtocols = ['http', 'https']
    const allowedExtensions = ['jpeg', 'jpg', 'png', 'bmp', 'webp', 'ico']

    const lines = text.split('\n')

    const processedLines = lines.map(line => {
      // Trim the line to remove leading and trailing whitespace
      // const trimmedLine = line.trim()

      const startsWithAllowedProtocol = allowedProtocols
        .some(protocol => line.startsWith(protocol))
      const endsWithAllowedExtension = allowedExtensions
        .some(format => line.endsWith(`.${format}`))
      const containsWhitespace = Array.from(line).some(
        char => char === ' '  ||
                char === '\t' ||
                char === '\n' ||
                char === '\r'
      )

      if (
        startsWithAllowedProtocol &&
        endsWithAllowedExtension &&
        !containsWhitespace
      ) {
        return `<img src="${line}" alt="Image">`
      }
      return line
    });

    // Join the processed lines back into a single string
    return processedLines.join('\n')
  }

  const wrapFullLineVideoLinksWithVideoTags = (
    text: string
  ) => {
    if (typeof(text) !== "string") return ''
    const allowedProtocols = ['http', 'https']
    const allowedExtensions = ['mp4', 'avi', 'mov', 'mkv', 'flv', 'webm']

    const lines = text.split('\n')

    const processedLines = lines.map(line => {
      // Trim the line to remove leading and trailing whitespace
      // const trimmedLine = line.trim()

      const startsWithAllowedProtocol = allowedProtocols
        .some(protocol => line.startsWith(protocol))
      const endsWithAllowedExtension = allowedExtensions
        .some(format => line.endsWith(`.${format}`))
      const containsWhitespace = Array.from(line).some(
        char => char === ' '  ||
                char === '\t' ||
                char === '\n' ||
                char === '\r'
      )

      if (
        startsWithAllowedProtocol &&
        endsWithAllowedExtension &&
        !containsWhitespace
      ) {
        const extension = line.split('.').pop()
        if (extension && typeof(extension) === 'string') {
          let type: string | undefined
          switch (extension.toLowerCase()) {
            case 'webm': type = 'video/webm'; break
            case 'ogg': type = 'video/ogg'; break
            case 'avi': type = 'video/x-msvideo'; break
            case 'mov': type = 'video/quicktime'; break
            case 'mkv': type = 'video/x-matroska'; break
            case 'flv': type = 'video/x-flv'; break
            default: type = 'video/mp4'  // Default type
          }

          return `<video width="920" height="517" loop controls><source src="${line}" type="${type}">Your browser does not support the video tag.</video>`
        }
      }
      return line
    });

    // Join the processed lines back into a single string
    return processedLines.join('\n')
  }

  const wrapFullLineAudioLinksWithAudioTags = (
    text: string
  ) => {
    if (typeof(text) !== "string") return ''
    const allowedProtocols = ['http', 'https']
    const allowedExtensions = ['mp3', 'wav', 'flac', 'aac', 'opus']

    const lines = text.split('\n')

    const processedLines = lines.map(line => {
      // Trim the line to remove leading and trailing whitespace
      // const trimmedLine = line.trim()

      const startsWithAllowedProtocol = allowedProtocols
        .some(protocol => line.startsWith(protocol))
      const endsWithAllowedExtension = allowedExtensions
        .some(format => line.endsWith(`.${format}`))
      const containsWhitespace = Array.from(line).some(
        char => char === ' '  ||
                char === '\t' ||
                char === '\n' ||
                char === '\r'
      )

      if (
        startsWithAllowedProtocol &&
        endsWithAllowedExtension &&
        !containsWhitespace
      ) {
        const extension = line.split('.').pop()
        if (extension && typeof(extension) === 'string') {
          let type: string | undefined
          switch (extension.toLowerCase()) {
            case 'wav': type = 'audio/wav'; break
            case 'flac': type = 'audio/flac'; break
            case 'aac': type = 'audio/aac'; break
            case 'opus': type = 'audio/opus'; break
            default: type = 'audio/mpeg'  // Default type
          }

          return `<audio loop controls><source src="${line}" type="${type}">Your browser does not support the audio tag.</audio>`
        }
      }
      return line
    });

    // Join the processed lines back into a single string
    return processedLines.join('\n')
  }

  const extractTextForDisplay = (
    event: SpasmEventV2
  ) => {
    const spasmEvent = spasm.toBeSpasmEventV2(event)
    if (!spasmEvent) return ""

    let content: string = ''
    if (
      'content' in spasmEvent && spasmEvent.content &&
      typeof(spasmEvent.content) === "string"
    ) { content = spasmEvent.content }

    let action: "post" | "reply" = "post"
    if (
      'action' in spasmEvent && spasmEvent.action &&
      typeof(spasmEvent.action) === "string"
    ) {
      if (
        spasmEvent.action === "post" ||
        spasmEvent.action === "reply"
      ) { action = spasmEvent.action }
    }

    return standardizeTextForDisplay(content, action)
  }

  return {
    standardizeTextForDisplay,
    extractTextForDisplay
  }
}
