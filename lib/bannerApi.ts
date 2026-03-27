import { graphqlRequest } from "./graphqlClient";

function isDebugGraphql(): boolean {
    try {
        return process.env.NEXT_PUBLIC_DEBUG_GRAPHQL === "true";
    } catch {
        return false;
    }
}

export interface Banner {
    id: string;
    title: string;
    subtitle: string;
    videoUrl?: string;
    images: string[];
    color?: string;
}

interface BannerGraphQL {
    _id: string;
    bannerTitle: string;
    bannerDesc?: string;
    bannerUrl: string;
    bannerType: 'VIDEO' | 'IMAGE';
    bannerStatus: 'ACTIVE' | 'INACTIVE';
}

/**
 * 💡 STRICT GRAPHQL ONLY. NO MOCKS.
 */
export async function getBanners(): Promise<Banner[]> {
    if (isDebugGraphql()) {
        console.log("BannerApi: getBanners called (STRICT GQL)");
    }

    try {
        const data = await graphqlRequest<{ getBanners: BannerGraphQL[] }>(
            `
            query GetBanners {
                getBanners {
                    _id
                    bannerTitle
                    bannerDesc
                    bannerUrl
                    bannerType
                    bannerStatus
                }
            }
            `
        );

        if (!data || !data.getBanners) {
            return [];
        }

        return data.getBanners
            .filter(b => b.bannerStatus === 'ACTIVE')
            .map((b: BannerGraphQL) => ({
                id: b._id,
                title: b.bannerTitle,
                subtitle: b.bannerDesc || "",
                videoUrl: b.bannerType === 'VIDEO' ? b.bannerUrl : undefined,
                images: b.bannerType === 'IMAGE' ? [b.bannerUrl] : [],
                color: "#10b981", // Default theme color
            }));
    } catch (error) {
        console.error("BannerApi: getBanners CRITICAL ERROR:", error);
        // Throw or return empty based on UX preference. 
        // For banners, returning empty is better than crashing the whole home page.
        return [];
    }
}
