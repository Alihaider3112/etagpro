import mongoose from 'mongoose';
const { Schema } = mongoose;


const imageSchema =new Schema({
    image_url:{
      type:String,
      required:true,
    },
    public_id:{
      type:String,
      required:true,
    },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
})
module.exports = mongoose.model.imageSchema|| mongoose.model('images', imageSchema);