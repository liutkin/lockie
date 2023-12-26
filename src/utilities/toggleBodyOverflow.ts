const bodyElement = document.querySelector('body')

export const toggleBodyOverflow = (overflowed: boolean): void => {
    const method = overflowed ? 'add' : 'remove'
    ;(bodyElement as HTMLBodyElement).classList[method]('overflow-hidden')
}
