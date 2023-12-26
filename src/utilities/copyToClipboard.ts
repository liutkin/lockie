export const copyToClipboard = (text: string): void | Promise<void> =>
    navigator && navigator.clipboard && navigator.clipboard.writeText
        ? navigator.clipboard.writeText(text)
        : Promise.reject(new Error('The Clipboard API is not available.'))
