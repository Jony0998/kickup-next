async function main() {
    const query = `
    {
        properties {
            _id
            propertyName
            propertyStatus
            location {
                city
            }
            propertyType
        }
    }
    `;

    try {
        const response = await fetch('http://localhost:3008/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

main();
