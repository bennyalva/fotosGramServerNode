import { Schema, Document, model} from 'mongoose';

const postSchema = new Schema({
    created: {
        type: Date
    },
    mensaje: {
        type: String
    },
    imgs: [
        {
            type: String
        }
    ],
    coords: {
        type: String//lat, lng
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref:'Usuario',
        required: [true,'Debe existir relación en db']
    }
});

postSchema.pre<IPost>('save', function(next) {
    this.created = new Date();
    next();
});

interface IPost extends Document {
    created: Date;
    mensaje: string;
    img: string[],
    coords: string,
    usuario: string
}

export const Post = model<IPost>('Post', postSchema);