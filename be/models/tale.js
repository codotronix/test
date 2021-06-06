// const mongoose = require('mongoose')

// const taleSchema = new mongoose.Schema({
//     id: String,     // this is not PKey, not even Uniq this is for local UI only
//     idCounter: Number,
//     start: String,
    
//     info: {
//         authorEmail: {
//             type: String,
//             required: true
//         },
//         description: {
//             type: String,
//             required: true
//         },
//         desiredUrl: String,
//         storyUrl: {     // This is PKey
//             type: String,
//             required: true
//         },
//         genre: {
//             type: String,
//             required: true
//         },
//         imgUrl: String,
//         lang: {
//             type: String,
//             required: true
//         },
//         name: {
//             type: String,
//             required: true
//         },
//         originalAuthor: String,
//         tags: [String]
//     },
//     choices: mongoose.SchemaTypes.Mixed,
//     reactos: mongoose.SchemaTypes.Mixed,
//     storylets: mongoose.SchemaTypes.Mixed
// })

// module.exports = mongoose.model('Tale', taleSchema)