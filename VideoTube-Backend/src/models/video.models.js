import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';


const videoSchema = new Schema({
    videoFile:{
        type: String,     // cloudinary url
        required: true
    },
    thumbnail: {
        type: String,     // cloudinary url
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    Owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true }
)

// plugin for pagination in mongoose
// it helps to paginate the comments i.e, to show only a certain number of comments on a page ( kaha se kaha tak ek bar mein cheeze dikhani hai)
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model('Video', videoSchema);