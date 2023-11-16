import mongoose from 'mongoose';

export const URI = 'mongodb+srv://vherrera010:Jazmin1646!@cluster0.0bqs67z.mongodb.net/e-commerce?retryWrites=true&w=majority';

export const init = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Database is ok 🚀');
  } catch (error) {
    console.error('A problem has occurred when accessing Mongo DB 😨', error.message);
  }
};