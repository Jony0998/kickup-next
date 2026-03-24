import { graphqlRequest } from "./graphqlClient";

// ==================== TYPES ====================

export interface Rating {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  matchId?: string;
  fieldId?: string;
  rating: number;
  review?: string;
  createdAt: string;
}

export interface RatingStats {
  average: number;
  total: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// ==================== SUBMIT RATING ====================

export async function submitRating(
  matchId: string,
  fieldId: string,
  rating: number,
  review?: string
): Promise<Rating> {
  try {
    const data = await graphqlRequest<any>(
      `
        mutation SubmitRating($matchId: ID!, $fieldId: ID!, $rating: Int!, $review: String) {
          submitRating(matchId: $matchId, fieldId: $fieldId, rating: $rating, review: $review) {
            _id
            userId
            userName
            userAvatar
            matchId
            fieldId
            rating
            review
            createdAt
          }
        }
      `,
      {
        variables: { matchId, fieldId, rating, review },
        auth: true,
      }
    );

    const r = data.submitRating;

    return {
      id: r._id,
      userId: r.userId,
      userName: r.userName,
      userAvatar: r.userAvatar,
      matchId: r.matchId,
      fieldId: r.fieldId,
      rating: r.rating,
      review: r.review,
      createdAt: r.createdAt,
    };
  } catch (error: any) {
    console.error("Error submitting rating:", error);
    throw new Error(error?.message || "Failed to submit rating");
  }
}

// ==================== GET RATINGS ====================

export async function getRatings(
  matchId?: string,
  fieldId?: string
): Promise<{ ratings: Rating[]; stats: RatingStats }> {
  try {
    const data = await graphqlRequest<any>(
      `
        query GetRatings($matchId: ID, $fieldId: ID) {
          ratings(matchId: $matchId, fieldId: $fieldId) {
            _id
            userId
            userName
            userAvatar
            matchId
            fieldId
            rating
            review
            createdAt
          }
          ratingStats(matchId: $matchId, fieldId: $fieldId) {
            average
            total
            distribution {
              five
              four
              three
              two
              one
            }
          }
        }
      `,
      {
        variables: { matchId, fieldId },
        auth: true,
      }
    );

    return {
      ratings: data.ratings.map((r: any) => ({
        id: r._id,
        userId: r.userId,
        userName: r.userName,
        userAvatar: r.userAvatar,
        matchId: r.matchId,
        fieldId: r.fieldId,
        rating: r.rating,
        review: r.review,
        createdAt: r.createdAt,
      })),
      stats: {
        average: data.ratingStats.average,
        total: data.ratingStats.total,
        distribution: {
          5: data.ratingStats.distribution.five,
          4: data.ratingStats.distribution.four,
          3: data.ratingStats.distribution.three,
          2: data.ratingStats.distribution.two,
          1: data.ratingStats.distribution.one,
        },
      },
    };
  } catch (error: any) {
    console.error("Error fetching ratings:", error);
    throw new Error(error?.message || "Failed to fetch ratings");
  }
}