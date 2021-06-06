export type TReactale = {
    _fireID: string     // Firebase ID
    id: string         // Local id, to avoid offline tales naming clash
    idCounter: number  // For internal use (id tracking)
    start: string
    isPublished: boolean
    info: TReactaleInfo
    storylets: { [StoryletID: string]: TStorylet }
    choices: { [ChoiceID: string]: TChoice }
    reactos: TReactos
    storyboard?: TStoryBoardItem[]  // Optional, for internal rendering purpose
}

export type TStoryBoardItem = { stID: string, selectedCID: string }


/**
 * Used internally by TReactale
 */
type TReactaleInfo = {
    name: string
    description: string
    genre: string
    lang: string
    tags: string[]
    authorEmail: string
    authorEmailEnc?: string // For other authors, to protect their privacy
    originalAuthor: string
    storyUrl: string        // the PKey
    desiredUrl: string      // what user wants
    imgUrl: string 
    imgUrlSquare: string
    doC: number             // date of creation
    doM: number             // date of modification
}

type TChoiceID = string
type TStoryletID = string

export type TStorylet = {
    id: TStoryletID
    title: string
    text: string
    choices: TChoiceID[]       // ChoiceIDs
}

export type TChoice = {
    id: TChoiceID
    text: string
    next: TStoryletID          // StoryletID
}

/**
 * Used internally by TReactale
 */
type TReactos = {
    vars: { [varName: string]: TReactoVar }
}

/**
 * Used internally by TReactos
 */
export type TReactoVar = {
    name: string;
    val: string;
    userCustomizable: boolean;
    helptext: string;
}


export type TGroupRtlByGenre = { [genre:string]: TReactale[] }