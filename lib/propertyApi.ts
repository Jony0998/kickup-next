import { graphqlRequest } from "./graphqlClient";

export interface Coordinates {
    lat?: number;
    lng?: number;
}

export interface PropertyLocation {
    address: string;
    city: string;
    district?: string;
    coordinates?: Coordinates;
}

export interface Property {
    id: string;
    propertyName: string;
    propertyDescription?: string;
    propertyType: string;
    propertyStatus: string;
    location: PropertyLocation;
    amenities?: string[];
    fieldSize?: {
        width?: number;
        length?: number;
    };
    capacity?: number;
    hourlyRate?: number;
    images?: string[];
    rating?: {
        average: number;
        count: number;
    };
    isRecommended: boolean;
}

/**
 * 💡 STRICT GRAPHQL ONLY. NO MOCKS.
 */

// Get properties
export async function getProperties(filter?: {
    ownerId?: string;
    city?: string;
    district?: string;
    status?: string;
    type?: string;
    isRecommended?: boolean;
    limit?: number;
    skip?: number;
}): Promise<Property[]> {
    console.log("PropertyApi: getProperties called (STRICT GQL)", filter);

    try {
        type PropertiesQuery = {
            properties: Array<{
                _id: string;
                propertyName: string;
                propertyDescription?: string;
                propertyType: string;
                propertyStatus: string;
                location: {
                    address: string;
                    city: string;
                    district?: string;
                    coordinates?: {
                        lat?: number;
                        lng?: number;
                    };
                };
                amenities?: string[];
                fieldSize?: {
                    width?: number;
                    length?: number;
                };
                capacity?: number;
                hourlyRate?: number;
                images?: string[];
                rating?: {
                    average: number;
                    count: number;
                };
                isRecommended: boolean;
            }>;
        };

        const data = await graphqlRequest<PropertiesQuery>(
            `
            query GetProperties(
                $ownerId: ID,
                $city: String, 
                $district: String, 
                $status: PropertyStatus, 
                $type: PropertyType,
                $isRecommended: Boolean,
                $limit: Float,
                $skip: Float
            ) {
                properties(
                    ownerId: $ownerId,
                    city: $city, 
                    district: $district, 
                    status: $status, 
                    type: $type,
                    isRecommended: $isRecommended,
                    limit: $limit,
                    skip: $skip
                ) {
                    _id
                    propertyName
                    propertyDescription
                    propertyType
                    propertyStatus
                    location {
                        address
                        city
                        district
                        coordinates {
                            lat
                            lng
                        }
                    }
                    amenities
                    fieldSize {
                        width
                        length
                    }
                    capacity
                    hourlyRate
                    images
                    rating {
                        average
                        count
                    }
                    isRecommended
                }
            }
            `,
            {
                variables: filter,
            }
        );

        return data.properties.map((p) => ({
            id: p._id,
            propertyName: p.propertyName,
            propertyDescription: p.propertyDescription,
            propertyType: p.propertyType,
            propertyStatus: p.propertyStatus,
            location: p.location,
            amenities: p.amenities,
            fieldSize: p.fieldSize,
            capacity: p.capacity,
            hourlyRate: p.hourlyRate,
            images: p.images || [],
            rating: p.rating,
            isRecommended: p.isRecommended,
        }));
    } catch (error) {
        console.error("PropertyApi: getProperties CRITICAL ERROR:", error);
        return [];
    }
}

// Get single property
export async function getProperty(id: string): Promise<Property | null> {
    console.log("PropertyApi: getProperty called (STRICT GQL)", id);

    try {
        type PropertyQuery = {
            property: {
                _id: string;
                propertyName: string;
                propertyDescription?: string;
                propertyType: string;
                propertyStatus: string;
                location: {
                    address: string;
                    city: string;
                    district?: string;
                    coordinates?: {
                        lat?: number;
                        lng?: number;
                    };
                };
                amenities?: string[];
                fieldSize?: {
                    width?: number;
                    length?: number;
                };
                capacity?: number;
                hourlyRate?: number;
                images?: string[];
                rating?: {
                    average: number;
                    count: number;
                };
                isRecommended: boolean;
            };
        };

        const data = await graphqlRequest<PropertyQuery>(
            `
            query GetProperty($id: ID!) {
                property(id: $id) {
                    _id
                    propertyName
                    propertyDescription
                    propertyType
                    propertyStatus
                    location {
                        address
                        city
                        district
                        coordinates {
                            lat
                            lng
                        }
                    }
                    amenities
                    fieldSize {
                        width
                        length
                    }
                    capacity
                    hourlyRate
                    images
                    rating {
                        average
                        count
                    }
                    isRecommended
                }
            }
            `,
            {
                variables: { id },
                auth: true
            }
        );

        const p = data.property;
        if (!p) return null;

        return {
            id: p._id,
            propertyName: p.propertyName,
            propertyDescription: p.propertyDescription,
            propertyType: p.propertyType,
            propertyStatus: p.propertyStatus,
            location: p.location,
            amenities: p.amenities,
            fieldSize: p.fieldSize,
            capacity: p.capacity,
            hourlyRate: p.hourlyRate,
            images: p.images || [],
            rating: p.rating,
            isRecommended: p.isRecommended,
        };
    } catch (error) {
        console.error("PropertyApi: getProperty CRITICAL ERROR:", error);
        return null;
    }
}

/** Update property (e.g. images array). updateData is merged on backend. */
export async function updateProperty(
    id: string,
    updateData: { images?: string[]; [key: string]: unknown }
): Promise<Property | null> {
    try {
        const data = await graphqlRequest<{ updateProperty: { _id: string; images?: string[] } }>(
            `
            mutation UpdateProperty($id: ID!, $updateData: String!) {
                updateProperty(id: $id, updateData: $updateData) {
                    _id
                    images
                }
            }
            `,
            {
                variables: { id, updateData: JSON.stringify(updateData) },
                auth: true,
            }
        );
        if (!data.updateProperty) return null;
        const updated = await getProperty(id);
        return updated;
    } catch (error) {
        console.error("PropertyApi: updateProperty error", error);
        return null;
    }
}
