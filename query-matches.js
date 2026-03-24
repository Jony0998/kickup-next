async function main() {
    const query = `
    {
        matches(status: UPCOMING) {
            _id
            matchTitle
            matchStatus
            fieldId {
                _id
                propertyName
            }
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
        console.log("Matches API Response:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

main();
