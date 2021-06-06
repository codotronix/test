export enum E_NOTIF_TYPE {
    SIMPLE="SIMPLE", ACTION="ACTION"
}

export enum E_NOTIF_NAME {
    SOMEONE_FOLLOWED_YOU = 'SOMEONE_FOLLOWED_YOU',
    FAV_AUTHOR_PUBLISHED = 'FAV_AUTHOR_PUBLISHED',
    LINK_A_TALE_REQUEST = 'LINK_A_TALE_REQUEST'
}

type TNotifBaseType = {
    doC: number,
    name: E_NOTIF_NAME,
    type: E_NOTIF_TYPE,
    forEmails: string[]   // All the emailIDs from whom this notification is applicable 
}

export type TNotifSomeoneFollowed = TNotifBaseType & {
    followerName: string,
    followerID: string
}

export type TNotifFavAuthorPublished = TNotifBaseType & {
    publisherName: string,
    publisherID: string,
    storyName: string,
    storyUrl: string
}

export type TNotifLinkATaleRequest = TNotifBaseType & {
    fromUrl: string
    fromStoryName: string,
    requestorEmail: string,
    requestorName: string,
    requestorID: string,
    fromStoryUrl: string,
    fromStID: string,
    toUrl: string,
    choiceTxt: string
}

export type TNotif = TNotifLinkATaleRequest | TNotifFavAuthorPublished | TNotifSomeoneFollowed