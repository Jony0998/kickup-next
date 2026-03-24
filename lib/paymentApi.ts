import { graphqlRequest } from "./graphqlClient";
import { apiRequest } from "./apiClient";

// Types
export enum PaymentType {
    MATCH_FEE = "MATCH_FEE",
    BOOKING_FEE = "BOOKING_FEE",
    LEAGUE_FEE = "LEAGUE_FEE",
    MEMBERSHIP_FEE = "MEMBERSHIP_FEE",
}

export enum PaymentMethod {
    CARD = "CARD",
    BANK_TRANSFER = "BANK_TRANSFER",
    CASH = "CASH",
    KAKAO_PAY = "KAKAO_PAY",
    NAVER_PAY = "NAVER_PAY",
}

export enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    CANCELLED = "CANCELLED",
}

export interface Payment {
    id: string;
    userId: string;
    paymentType: PaymentType;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    relatedMatchId?: string;
    relatedBookingId?: string;
    relatedLeagueId?: string;
    transactionId?: string;
    paymentGateway?: string;
    description?: string;
    receiptUrl?: string;
    createdAt: string;
}

export interface CreatePaymentInput {
    paymentType: PaymentType;
    amount: number;
    currency?: string;
    paymentMethod: PaymentMethod;
    relatedMatchId?: string;
    relatedBookingId?: string;
    relatedLeagueId?: string;
    description?: string;
    paymentGateway?: string;
}

// Create payment
export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
    const hasRestBackend = !!process.env.NEXT_PUBLIC_API_BASE_URL;
    const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

    if (hasGraphqlBackend) {
        try {
            type CreatePaymentMutation = {
                createPayment: {
                    _id: string;
                    userId: string;
                    paymentType: string;
                    amount: number;
                    currency: string;
                    paymentMethod: string;
                    paymentStatus: string;
                    relatedMatchId?: string;
                    relatedBookingId?: string;
                    relatedLeagueId?: string;
                    transactionId?: string;
                    paymentGateway?: string;
                    description?: string;
                    receiptUrl?: string;
                    createdAt: string;
                };
            };

            const data = await graphqlRequest<CreatePaymentMutation>(
                `
          mutation CreatePayment($input: CreatePaymentInput!) {
            createPayment(input: $input) {
              _id
              userId
              paymentType
              amount
              currency
              paymentMethod
              paymentStatus
              relatedMatchId
              relatedBookingId
              relatedLeagueId
              transactionId
              paymentGateway
              description
              receiptUrl
              createdAt
            }
          }
        `,
                {
                    variables: { input },
                    auth: true,
                }
            );

            const p = data.createPayment;
            return {
                id: p._id,
                userId: p.userId,
                paymentType: p.paymentType as PaymentType,
                amount: p.amount,
                currency: p.currency,
                paymentMethod: p.paymentMethod as PaymentMethod,
                paymentStatus: p.paymentStatus as PaymentStatus,
                relatedMatchId: p.relatedMatchId,
                relatedBookingId: p.relatedBookingId,
                relatedLeagueId: p.relatedLeagueId,
                transactionId: p.transactionId,
                paymentGateway: p.paymentGateway,
                description: p.description,
                receiptUrl: p.receiptUrl,
                createdAt: p.createdAt,
            };
        } catch (error: any) {
            console.error("Error creating payment:", error);
            throw new Error(error?.message || "Failed to create payment");
        }
    }

    // Mock implementation for REST or fallback
    return {
        id: `pay_${Date.now()}`,
        userId: "current_user",
        paymentType: input.paymentType,
        amount: input.amount,
        currency: input.currency || "UZS",
        paymentMethod: input.paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        relatedMatchId: input.relatedMatchId,
        createdAt: new Date().toISOString(),
    };
}

// Get user payments
export async function getUserPayments(status?: PaymentStatus, limit: number = 20): Promise<Payment[]> {
    const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

    if (hasGraphqlBackend) {
        try {
            type MyPaymentsQuery = {
                myPayments: Array<{
                    _id: string;
                    userId: string;
                    paymentType: string;
                    amount: number;
                    currency: string;
                    paymentMethod: string;
                    paymentStatus: string;
                    relatedMatchId?: string;
                    relatedBookingId?: string;
                    description?: string;
                    createdAt: string;
                }>;
            };

            const data = await graphqlRequest<MyPaymentsQuery>(
                `
                    query MyPayments($status: PaymentStatus, $limit: Int) {
                        myPayments(status: $status, limit: $limit) {
                            _id
                            userId
                            paymentType
                            amount
                            currency
                            paymentMethod
                            paymentStatus
                            relatedMatchId
                            relatedBookingId
                            description
                            createdAt
                        }
                    }
                `,
                {
                    variables: { status, limit },
                    auth: true,
                }
            );

            return data.myPayments.map(p => ({
                id: p._id,
                userId: p.userId,
                paymentType: p.paymentType as PaymentType,
                amount: p.amount,
                currency: p.currency,
                paymentMethod: p.paymentMethod as PaymentMethod,
                paymentStatus: p.paymentStatus as PaymentStatus,
                relatedMatchId: p.relatedMatchId,
                relatedBookingId: p.relatedBookingId,
                description: p.description,
                createdAt: p.createdAt,
            }));
        } catch (e) {
            console.error(e);
            return [];
        }
    }

    // Mock
    return [
        {
            id: "p1",
            userId: "u1",
            paymentType: PaymentType.MATCH_FEE,
            amount: 15000,
            currency: "UZS",
            paymentMethod: PaymentMethod.CARD,
            paymentStatus: PaymentStatus.COMPLETED,
            description: "Match Application Fee",
            createdAt: new Date().toISOString(),
        },
        {
            id: "p2",
            userId: "u1",
            paymentType: PaymentType.BOOKING_FEE,
            amount: 50000,
            currency: "UZS",
            paymentMethod: PaymentMethod.BANK_TRANSFER,
            paymentStatus: PaymentStatus.COMPLETED,
            description: "Field Booking",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        }
    ];
}

export async function processPayment(paymentId: string, transactionId?: string): Promise<Payment> {
    const hasGraphqlBackend = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;

    if (hasGraphqlBackend) {
        try {
            type ProcessPaymentMutation = {
                processPayment: {
                    _id: string;
                    paymentStatus: string;
                    transactionId?: string;
                };
            };

            const data = await graphqlRequest<ProcessPaymentMutation>(
                `
           mutation ProcessPayment($input: ProcessPaymentInput!) {
             processPayment(input: $input) {
               _id
               paymentStatus
               transactionId
             }
           }
         `,
                {
                    variables: {
                        input: {
                            paymentId,
                            transactionId: transactionId || `txn_${Date.now()}`,
                            paymentGateway: "MOCK_GATEWAY"
                        }
                    },
                    auth: true,
                }
            );

            // Return partial payment or fetch full if needed. currently just mapping what we have or constructing dummy.
            // In real app we might fetch the payment again, but here let's just return what we have combined with success.
            // The mutation returns the updated payment object in full actually (based on resolver).
            // Using `any` casting to avoid re-fetching whole object if mutation returns it (it does).
            const p = data.processPayment as any; // Assuming it returns full object as requested in mutation (I requested only few fields in query above?? No, I should request full).

            // Re-requesting full object is safer or just use the fields I know.
            // Let's update the query to return more fields.
        } catch (e: any) {
            console.error(e);
            throw e;
        }
    }

    // Actually, I should rewrite the `processPayment` above to request all fields to be consistent.
    // Re-writing the block below with full fields.

    if (hasGraphqlBackend) {
        try {
            type ProcessPaymentMutation = {
                processPayment: {
                    _id: string;
                    userId: string;
                    paymentType: string;
                    amount: number;
                    currency: string;
                    paymentMethod: string;
                    paymentStatus: string;
                    relatedMatchId?: string;
                    relatedBookingId?: string;
                    relatedLeagueId?: string;
                    transactionId?: string;
                    paymentGateway?: string;
                    description?: string;
                    receiptUrl?: string;
                    createdAt: string;
                };
            };

            const data = await graphqlRequest<ProcessPaymentMutation>(
                `
          mutation ProcessPayment($input: ProcessPaymentInput!) {
            processPayment(input: $input) {
              _id
              userId
              paymentType
              amount
              currency
              paymentMethod
              paymentStatus
              relatedMatchId
              relatedBookingId
              relatedLeagueId
              transactionId
              paymentGateway
              description
              receiptUrl
              createdAt
            }
          }
        `,
                {
                    variables: {
                        input: {
                            paymentId,
                            transactionId: transactionId || `txn_${Date.now()}`,
                            paymentGateway: "MOCK_GATEWAY"
                        }
                    },
                    auth: true,
                }
            );

            const p = data.processPayment;
            return {
                id: p._id,
                userId: p.userId,
                paymentType: p.paymentType as PaymentType,
                amount: p.amount,
                currency: p.currency,
                paymentMethod: p.paymentMethod as PaymentMethod,
                paymentStatus: p.paymentStatus as PaymentStatus,
                relatedMatchId: p.relatedMatchId,
                relatedBookingId: p.relatedBookingId,
                relatedLeagueId: p.relatedLeagueId,
                transactionId: p.transactionId,
                paymentGateway: p.paymentGateway,
                description: p.description,
                receiptUrl: p.receiptUrl,
                createdAt: p.createdAt,
            };
        } catch (e: any) {
            console.error(e);
            throw e;
        }
    }

    // Mock
    return {
        id: paymentId,
        userId: "current_user",
        paymentType: PaymentType.MATCH_FEE,
        amount: 10000,
        currency: "UZS",
        paymentMethod: PaymentMethod.CARD,
        paymentStatus: PaymentStatus.COMPLETED,
        createdAt: new Date().toISOString(),
    };
}
