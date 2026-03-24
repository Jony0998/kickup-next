const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://Jony_me:yHaaQ8mcFCY5jZlo@cluster0.y2l0kvg.mongodb.net/Kickup";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('Kickup');

        const banners = await database.collection('banners').find({}).toArray();
        console.log("--- Banners ---");
        console.log(JSON.stringify(banners.map(b => ({
            id: b._id,
            title: b.bannerTitle,
            url: b.bannerUrl
        })), null, 2));

        const properties = await database.collection('properties').find({}).toArray();
        console.log("--- Properties ---");
        console.log(JSON.stringify(properties.map(p => ({
            id: p._id,
            name: p.propertyName,
            images: p.images
        })), null, 2));

        const matches = await database.collection('matches').find({}).toArray();
        console.log("--- Matches ---");
        console.log(JSON.stringify(matches.map(m => ({
            id: m._id,
            title: m.matchTitle,
            fieldId: m.fieldId
        })), null, 2));

    } finally {
        await client.close();
    }
}

main().catch(console.error);
