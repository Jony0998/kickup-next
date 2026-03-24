const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://Jony_me:yHaaQ8mcFCY5jZlo@cluster0.y2l0kvg.mongodb.net/Kickup";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('Kickup');
        const properties = database.collection('properties');

        const mockData = [
            {
                propertyName: "Goyang Daily Ground Futsal Center Madu",
                propertyDescription: "Best futsal center in Goyang",
                propertyType: "OUTDOOR",
                propertyStatus: "ACTIVE",
                location: {
                    address: "123 Madu-dong",
                    city: "GOYANG",
                    district: "Ilsandong-gu"
                },
                amenities: ["PARKING", "RESTROOM", "VEST_RENTAL", "BALL_RENTAL"],
                fieldSize: { width: 40, length: 20 },
                hourlyRate: 55000,
                isRecommended: true,
                views: 0,
                bookings: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                propertyName: "Goyang Soccer Story Unjeong",
                propertyDescription: "Indoor and outdoor fields available",
                propertyType: "INDOOR",
                propertyStatus: "ACTIVE",
                location: {
                    address: "456 Unjeong-dong",
                    city: "GOYANG",
                    district: "Paju"
                },
                amenities: ["PARKING", "RESTROOM"],
                fieldSize: { width: 18, length: 8 },
                hourlyRate: 30000,
                isRecommended: false,
                views: 0,
                bookings: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                propertyName: "Seoul Futsal Park",
                propertyDescription: "Premium center in Seoul",
                propertyType: "OUTDOOR",
                propertyStatus: "ACTIVE",
                location: {
                    address: "789 Gangnam-gu",
                    city: "SEOUL",
                    district: "Gangnam"
                },
                amenities: ["PARKING", "SHOWER", "CAFE"],
                fieldSize: { width: 40, length: 20 },
                hourlyRate: 60000,
                isRecommended: true,
                views: 0,
                bookings: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        const result = await properties.insertMany(mockData);
        console.log(`${result.insertedCount} properties were inserted`);

    } finally {
        await client.close();
    }
}

main().catch(console.error);
