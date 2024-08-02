import mongoose from 'mongoose';
const { Schema } = mongoose;


const productSchema = new Schema({
    brand_name: String, 
    brand_id: {
        type: Schema.Types.ObjectId,
        ref: 'brand'
      },
    serial_number:String,
    created_by:String,
    created_at:Date,
    updated_by:String,
    updated_at:Date,
    company_name:String,
    company_id:String,
    image_url: String 
})
module.exports = mongoose.models.product || mongoose.model('product', productSchema);