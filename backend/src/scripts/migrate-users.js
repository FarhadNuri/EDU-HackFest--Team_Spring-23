import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/auth.model.js'

dotenv.config()

async function migrateUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('✓ Connected to MongoDB')

        // Update all users without userType to be farmers
        const result = await User.updateMany(
            { userType: { $exists: false } },
            { $set: { userType: 'farmer' } }
        )
        
        console.log(`✓ Updated ${result.modifiedCount} users to have userType: 'farmer'`)

        // Update all users without upazilla to have empty string
        const result2 = await User.updateMany(
            { upazilla: { $exists: false } },
            { $set: { upazilla: '' } }
        )
        
        console.log(`✓ Updated ${result2.modifiedCount} users to have upazilla field`)

        // Show all users
        const users = await User.find({}).select('fullname email userType upazilla district')
        console.log('\nAll users:')
        users.forEach(user => {
            console.log(`- ${user.fullname} (${user.email}): ${user.userType}, District: ${user.district}, Upazilla: "${user.upazilla}"`)
        })

        await mongoose.connection.close()
        console.log('\n✓ Migration completed')
    } catch (error) {
        console.error('❌ Migration failed:', error)
        process.exit(1)
    }
}

migrateUsers()
