const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  stock: Number,
  image: String,
  rating: Number
});

const Product = mongoose.model('Product', productSchema);

const updatePrices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    const products = await Product.find({});
    
    console.log('\n📦 Current Products:');
    products.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - Rs ${p.price}`);
    });

    const iphoneUpdate = await Product.updateMany(
      { name: /iphone/i },
      { $set: { price: 300000 } }
    );
    console.log(`\n✅ Updated ${iphoneUpdate.modifiedCount} iPhone(s) to Rs 300,000`);

    const samsungUpdate = await Product.updateMany(
      { name: /samsung/i },
      { $set: { price: 28000 } }
    );
    console.log(`✅ Updated ${samsungUpdate.modifiedCount} Samsung(s) to Rs 28,000`);

    const updatedProducts = await Product.find({});
    console.log('\n🎉 Updated Products:');
    updatedProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - Rs ${p.price}`);
    });

    console.log('\n✨ Done!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updatePrices();