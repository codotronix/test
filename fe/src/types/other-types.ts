export type TWindow = Window & typeof globalThis & {
    notify: (txt:string, type?:string) => void
    showLoader: (txt?: string) => void
    hideLoader: () => void
    LZString: LZString.LZStringStatic,
    rto: any
}