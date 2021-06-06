import { TReactale, TTimelineConfig } from './TReactale'

export type TWindow = Window & typeof globalThis & {
    notify: (txt:string, type?:string) => void
    showLoader: (txt?: string) => void
    hideLoader: () => void
    LZString: LZString.LZStringStatic,
    rto: TRtoGlobal
}

export type TRtoGlobal = {
    copyToClipboard: (value: string, successMsg: string) => void
    createTimeline: (elementID: string, rtl: TReactale, config: TTimelineConfig) => void
    process: (rtxt: string) => string
    getLoggedInUserAuthData: () => any
    setAllVars: (vars: TCustomReactoVars) => any
}

/**
 * Object of { k1: v1, k2: v2 }
 */
export type TCustomReactoVars = {
    [reactoVarName: string]: string
}