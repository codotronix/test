import React from 'react'
import { config } from '../../../utils/urls'

const JSONLD = props => {
    const { info } = props
    // const jsonld = {
    //     "@context": "https://schema.org",
    //     "@type": "Article",
    //     "headline": info.name,
    //     "alternativeHeadline": "A Reactale",
    //     "image": info.imgUrl || config.defaultImg,
    //     "author": info.author || info.originalAuthor,
    //     "genre": info.genre,
    //     "keywords": info.tags,
    //     "publisher": {
    //         "@type": "Organization",
    //         "name": "Reactale",
    //         "logo": {
    //             "@type": "ImageObject",
    //             "url": "https://reactale.com/assets/img/logo/Reactale-logo-40h-red-on-transparent-bg.png"
    //         }
    //     },
    //     "url": "https://reactale.com/rtale/read-story/1",
    //     "mainEntityOfPage": {
    //         "@type": "WebPage",
    //         "@id": `${config.origin}/read/${info.storyUrl}`
    //     },
    //     "dateCreated": info.dateCreated,
    //     "datePublished": info.datePublished,
    //     "dateModified": info.dateModified,
    //     "description": info.description
    // }
    const desc = info.description.replace(/"/g, '')
    // console.log("desc", desc)
    const jsonldHTML = {
        __html: `
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "${info.name}",
            "alternativeHeadline": "A Reactale",
            "image": "${info.imgUrl || config.defaultImg}",
            "author": "${info.author || info.originalAuthor}",
            "genre": "${info.genre}",
            "keywords": "${info.tags}",
            "publisher": {
                "@type": "Organization",
                "name": "Reactale",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://reactale.com/assets/img/logo/Reactale-logo-40h-red-on-transparent-bg.png"
                }
            },
            "url": "https://reactale.com/rtale/read-story/1",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "${config.origin}/read/${info.storyUrl}"
            },
            "dateCreated": "${info.dateCreated}",
            "datePublished": "${info.datePublished}",
            "dateModified": "${info.dateModified}",
            "description": "${desc}"
        }
        `
    }
    return (
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonldHTML}>
        </script>
    )
}

export default JSONLD