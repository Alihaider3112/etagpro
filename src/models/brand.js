import mongoose from 'mongoose';
const { Schema } = mongoose;


const brandSchema = new Schema({
    name: String, 
    created_by:String,
    created_at:Date,
    updated_by:String,
    updated_at:Date,
    company_name:String,
    company_id:String,
})
module.exports = mongoose.models.brand || mongoose.model('brand', brandSchema);