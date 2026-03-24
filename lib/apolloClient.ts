import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { getPublicGraphqlUrl } from '@/lib/graphqlClient';

const httpLink = new HttpLink({
	uri: () => getPublicGraphqlUrl(),
	credentials: 'include', // Cookie yuboradi va qabul qiladi
});

export const apolloClient = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
});

