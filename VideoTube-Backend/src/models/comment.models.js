import mongoose, { Schema } from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        owener: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        video: {
                type: Schema.Types.ObjectId,
                ref: 'Video'
            }
    },
    { timestamps: true } 
)


// plugin for pagination in mongoose
// it helps to paginate the comments i.e, to show only a certain number of comments on a page ( kaha se kaha tak ek bar mein cheeze dikhani hai)
commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model('Comment', commentSchema);