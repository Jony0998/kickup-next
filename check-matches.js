const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://Jony_me:yHaaQ8mcFCY5jZlo@cluster0.y2l0kvg.mongodb.net/Kickup";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('Kickup');
        const matches = database.collection('matches');

        const allMatches = await matches.find({}).toArray();
        console.log("Total Matches:", allMatches.length);
        console.log("Details:", JSON.stringify(allMatches.map(m => ({
            id: m._id,
            title: m.matchTitle,
            status: m.matchStatus
        })), null, 2));

    } finally {
        await client.close();
    }
}

main().catch(console.error);
