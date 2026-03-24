const { MongoClient, ObjectId } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://Jony_me:yHaaQ8mcFCY5jZlo@cluster0.y2l0kvg.mongodb.net/Kickup";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('Kickup');
        const properties = database.collection('properties');
        const matches = database.collection('matches');

        // 1. Clear existing mocks
        await properties.deleteMany({});
        await matches.deleteMany({});
        console.log("Existing mocks cleared.");

        // 2. Insert Realistic Properties (Stadiums)
        const stadiumData = [
            {
                _id: new ObjectId(),
                propertyName: "Daily Ground Goyang",
                propertyDescription: "Premium futsal venue with artificial turf and night lighting.",
                propertyType: "OUTDOOR",
                propertyStatus: "ACTIVE",
                location: {
                    address: "Goyang-daero, Ilsandong-gu",
                    city: "GOYANG",
                    district: "Ilsandong-gu"
                },
                amenities: ["PARKING", "RESTROOM", "VENDING_MACHINE", "VEST_RENTAL"],
                fieldSize: { width: 40, length: 20 },
                hourlyRate: 55000,
                images: ["https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800"],
                rating: { average: 4.5, count: 12 },
                isRecommended: true,
                views: 125,
                bookings: 45,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                propertyName: "Seoul Futsal Park (Gangnam)",
                propertyDescription: "High-end indoor center near Gangnam Station.",
                propertyType: "INDOOR",
                propertyStatus: "ACTIVE",
                location: {
                    address: "Gangnam-daero 84-gil",
                    city: "SEOUL",
                    district: "Gangnam"
                },
                amenities: ["PARKING", "SHOWER", "AIR_CONDITIONING"],
                fieldSize: { width: 38, length: 18 },
                hourlyRate: 65000,
                images: ["https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=800"],
                rating: { average: 4.8, count: 24 },
                isRecommended: true,
                views: 340,
                bookings: 89,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                propertyName: "Incheon Sky Field",
                propertyDescription: "Rooftop futsal field with a great view of the city.",
                propertyType: "OUTDOOR",
                propertyStatus: "ACTIVE",
                location: {
                    address: "Songdo-ro, Yeonsu-gu",
                    city: "INCHEON",
                    district: "Yeonsu"
                },
                amenities: ["PARKING", "CAFE"],
                fieldSize: { width: 40, length: 20 },
                hourlyRate: 45000,
                images: ["https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=800"],
                rating: { average: 0, count: 0 },
                isRecommended: false,
                views: 90,
                bookings: 12,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        const propResult = await properties.insertMany(stadiumData);
        console.log(`${propResult.insertedCount} stadiums inserted.`);

        // 3. Insert Realistic Matches linked to these stadiums
        const matchData = [
            {
                matchTitle: "Friendly 6vs6 - Night Session",
                matchDescription: "Let's enjoy a fun 6vs6 game. All levels welcome!",
                matchType: "FRIENDLY",
                matchStatus: "UPCOMING",
                fieldId: stadiumData[0]._id, // Goyang
                matchDate: new Date().toISOString(),
                matchTime: "20:00",
                duration: 120,
                maxPlayers: 12,
                currentPlayers: 8,
                matchFee: 10000,
                skillLevel: "AMATEUR",
                gender: "MIXED",
                location: stadiumData[0].location,
                matchImage: stadiumData[0].images[0],
                views: 45,
                likes: 8,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                matchTitle: "[Pro] Competitive 5vs5 League",
                matchDescription: "Fast-paced game for experienced players only.",
                matchType: "LEAGUE",
                matchStatus: "UPCOMING",
                fieldId: stadiumData[1]._id, // Seoul
                matchDate: new Date().toISOString(),
                matchTime: "18:00",
                duration: 90,
                maxPlayers: 10,
                currentPlayers: 10,
                matchFee: 15000,
                skillLevel: "PRO",
                gender: "MALE",
                location: stadiumData[1].location,
                matchImage: stadiumData[1].images[0],
                views: 120,
                likes: 25,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                matchTitle: "Morning Futsal - Weekend Chill",
                matchDescription: "Light game to start the weekend.",
                matchType: "FRIENDLY",
                matchStatus: "UPCOMING",
                fieldId: stadiumData[2]._id, // Incheon
                matchDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                matchTime: "10:00",
                duration: 120,
                maxPlayers: 12,
                currentPlayers: 4,
                matchFee: 8000,
                skillLevel: "ROOKIE",
                gender: "MIXED",
                location: stadiumData[2].location,
                matchImage: stadiumData[2].images[0],
                views: 30,
                likes: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        const matchResult = await matches.insertMany(matchData);
        console.log(`${matchResult.insertedCount} matches inserted.`);

    } finally {
        await client.close();
    }
}

main().catch(console.error);
