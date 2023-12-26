export const copyToClipboard = (text) =>
    navigator && navigator.clipboard && navigator.clipboard.writeText
        ? navigator.clipboard.writeText(text)
        : Promise.reject(new Error('The Clipboard API is not available.'))
