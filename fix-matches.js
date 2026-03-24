const { MongoClient, ObjectId } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://Jony_me:yHaaQ8mcFCY5jZlo@cluster0.y2l0kvg.mongodb.net/Kickup";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('Kickup');
        const matches = database.collection('matches');
        const organizerId = new ObjectId("69942dd925eb2d71e1c8ae8e");

        const result = await matches.updateMany(
            { organizerId: { $exists: false } },
            { $set: { organizerId: organizerId } }
        );

        console.log(`${result.modifiedCount} matches updated with organizerId.`);

    } finally {
        await client.close();
    }
}

main().catch(console.error);
