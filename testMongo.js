const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/fertilizerStore';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB');
  mongoose.connection.close();
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:');
  console.error(err.message);
  console.error(err.stack);
});
