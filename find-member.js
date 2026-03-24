const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://Jony_me:yHaaQ8mcFCY5jZlo@cluster0.y2l0kvg.mongodb.net/Kickup";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('Kickup');
        const members = database.collection('members');

        const firstMember = await members.findOne({});
        console.log("Found Member:", JSON.stringify(firstMember, null, 2));

    } finally {
        await client.close();
    }
}

main().catch(console.error);
