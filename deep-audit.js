const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://Jony_me:yHaaQ8mcFCY5jZlo@cluster0.y2l0kvg.mongodb.net/Kickup";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('Kickup');

        const properties = await database.collection('properties').find({}).toArray();
        console.log("--- Properties Rating Check ---");
        properties.forEach(p => {
            console.log(`Property: ${p.propertyName} (${p._id})`);
            console.log(`  Rating: ${JSON.stringify(p.rating)}`);
        });

        const matches = await database.collection('matches').find({}).toArray();
        console.log("\n--- Matches Review ---");
        matches.forEach(m => {
            console.log(`Match: ${m.matchTitle} (${m._id})`);
            console.log(`  fieldId: ${m.fieldId}`);
            // Check if this fieldId exists in properties
            const fieldExists = properties.some(p => p._id.toString() === m.fieldId.toString());
            console.log(`  Field Exists: ${fieldExists}`);
        });

    } finally {
        await client.close();
    }
}

main().catch(console.error);
