const bodyElement = document.querySelector('body')

export default (overflowed: boolean): void =>
    bodyElement?.classList[overflowed ? 'add' : 'remove']('overflow-hidden')