const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb://localhost:27017/kickup";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('kickup');
        const properties = database.collection('properties');

        const allProperties = await properties.find({}).toArray();
        console.log("Total Properties:", allProperties.length);
        console.log("Details:", JSON.stringify(allProperties.map(p => ({
            name: p.propertyName,
            city: p.location.city,
            status: p.propertyStatus,
            type: p.propertyType
        })), null, 2));

    } finally {
        await client.close();
    }
}

main().catch(console.error);
