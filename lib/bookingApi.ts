import { graphqlRequest } from "./graphqlClient";
import { apiRequest } from "./apiClient";

// Types
export enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
}

export interface Booking {
    id: string;
    fieldId: string;
    bookerId: string;
    matchId?: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    duration: number;
    totalAmount: number;
    status: BookingStatus;
    paymentStatus: string;
    notes?: string;
    createdAt: string;
}

export interface CreateBookingInput {
    fieldId: string;
    bookingDate: string; // ISO date format
    startTime: string; // "HH:MM"
    endTime: string; // "HH:MM"
    duration: number; // Hours
    matchId?: string;
    totalAmount?: number;
    notes?: string;
}

// Create booking
export async function createBooking(input: CreateBookingInput): Promise<Booking> {
    const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

    if (hasGraphqlBackend) {
        try {
            type CreateBookingMutation = {
                createBooking: {
                    _id: string;
                    fieldId: string;
                    bookerId: string;
                    matchId?: string;
                    bookingDate: string;
                    startTime: string;
                    endTime: string;
                    duration: number;
                    totalAmount: number;
                    status: string;
                    paymentStatus: string;
                    notes?: string;
                    createdAt: string;
                };
            };

            const data = await graphqlRequest<CreateBookingMutation>(
                `
          mutation CreateBooking(
            $fieldId: ID!
            $bookingDate: DateTime!
            $startTime: String!
            $endTime: String!
            $duration: Float!
            $matchId: ID
            $totalAmount: Float
            $notes: String
          ) {
            createBooking(
              fieldId: $fieldId
              bookingDate: $bookingDate
              startTime: $startTime
              endTime: $endTime
              duration: $duration
              matchId: $matchId
              totalAmount: $totalAmount
              notes: $notes
            ) {
              _id
              fieldId
              bookerId
              matchId
              bookingDate
              startTime
              endTime
              duration
              totalAmount
              status
              paymentStatus
              notes
              createdAt
            }
          }
        `,
                {
                    variables: {
                        ...input,
                        bookingDate: new Date(input.bookingDate).toISOString(), // Ensure ISO string for DateTime scalar
                    },
                    auth: true,
                }
            );

            const b = data.createBooking;
            return {
                id: b._id,
                fieldId: b.fieldId,
                bookerId: b.bookerId,
                matchId: b.matchId,
                bookingDate: b.bookingDate,
                startTime: b.startTime,
                endTime: b.endTime,
                duration: b.duration,
                totalAmount: b.totalAmount,
                status: b.status as BookingStatus,
                paymentStatus: b.paymentStatus,
                notes: b.notes,
                createdAt: b.createdAt,
            };
        } catch (error: any) {
            console.error("Error creating booking:", error);
            throw new Error(error?.message || "Failed to create booking");
        }
    }

    // Mock
    return {
        id: `bk_${Date.now()}`,
        fieldId: input.fieldId,
        bookerId: "current_user",
        bookingDate: input.bookingDate,
        startTime: input.startTime,
        endTime: input.endTime,
        duration: input.duration,
        totalAmount: input.totalAmount || 0,
        status: BookingStatus.PENDING,
        paymentStatus: "PENDING",
        createdAt: new Date().toISOString(),
    };
}

// Check availability
export async function checkFieldAvailability(fieldId: string, date: string, startTime: string, endTime: string): Promise<boolean> {
    const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

    if (hasGraphqlBackend) {
        try {
            type CheckAvailabilityQuery = {
                checkAvailability: boolean;
            };

            const data = await graphqlRequest<CheckAvailabilityQuery>(
                `
                    query CheckAvailability($fieldId: ID!, $date: DateTime!, $startTime: String!, $endTime: String!) {
                        checkAvailability(fieldId: $fieldId, date: $date, startTime: $startTime, endTime: $endTime)
                    }
                `,
                {
                    variables: { fieldId, date: new Date(date).toISOString(), startTime, endTime },
                }
            );
            return data.checkAvailability;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
    return true;
}

// Get bookings by field
export async function getBookingsByField(fieldId: string, date?: string): Promise<Booking[]> {
    // Implementation for fetching bookings list
    const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

    if (hasGraphqlBackend) {
        try {
            type BookingsQuery = {
                bookings: Array<{
                    _id: string;
                    fieldId: string;
                    bookerId: string;
                    matchId?: string;
                    bookingDate: string;
                    startTime: string;
                    endTime: string;
                    duration: number;
                    totalAmount: number;
                    status: string;
                    paymentStatus: string;
                    notes?: string;
                    createdAt: string;
                }>
            };

            const data = await graphqlRequest<BookingsQuery>(
                `
                    query GetBookings($fieldId: ID!, $date: DateTime) {
                        bookings(fieldId: $fieldId, date: $date) {
                            _id
                            fieldId
                            bookerId
                            matchId
                            bookingDate
                            startTime
                            endTime
                            duration
                            totalAmount
                            status
                            paymentStatus
                            notes
                            createdAt
                        }
                    }
                `,
                {
                    variables: { fieldId, date: date ? new Date(date).toISOString() : undefined },
                }
            );

            return data.bookings.map(b => ({
                id: b._id,
                fieldId: b.fieldId,
                bookerId: b.bookerId,
                matchId: b.matchId,
                bookingDate: b.bookingDate,
                startTime: b.startTime,
                endTime: b.endTime,
                duration: b.duration,
                totalAmount: b.totalAmount,
                status: b.status as BookingStatus,
                paymentStatus: b.paymentStatus,
                notes: b.notes,
                createdAt: b.createdAt,
            }));

        } catch (e) {
            console.error(e);
            return [];
        }
    }
    return [];
}
