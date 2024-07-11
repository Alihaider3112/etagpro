
import mongoose from 'mongoose';
const { Schema } = mongoose;


const companiesSchema = new Schema({
    name: String, 
    created_by:String,
    created_at:Date,
    updated_by:String,
    updated_at:Date,
})
module.exports = mongoose.models.companies || mongoose.model('companies', companiesSchema);