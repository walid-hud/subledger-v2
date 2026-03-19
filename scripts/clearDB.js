import { connectDB } from '../config/db.js';
import User from '../models/User.model.js';
import Subscription from '../models/Subscription.model.js';
import Transaction from '../models/Transaction.model.js';

const clearDatabase = async () => {
  try {
    await connectDB();
    console.log('🗑️  Starting database cleanup...\n');

    // Clear all collections
    const userCount = await User.deleteMany({});
    console.log(`✓ Deleted ${userCount.deletedCount} users`);

    const subscriptionCount = await Subscription.deleteMany({});
    console.log(`✓ Deleted ${subscriptionCount.deletedCount} subscriptions`);

    const transactionCount = await Transaction.deleteMany({});
    console.log(`✓ Deleted ${transactionCount.deletedCount} transactions`);

    console.log('\n✨ Database cleared successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

await clearDatabase();
