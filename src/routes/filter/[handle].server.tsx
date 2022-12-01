/* eslint-disable prettier/prettier */
import {Suspense} from 'react';
import {
  gql,
  type HydrogenRouteProps,
  Seo,
  ShopifyAnalyticsConstants,
  useServerAnalytics,
  useLocalization,
  useShopQuery,
  type HydrogenRequest,
  type HydrogenApiRouteOptions,
} from '@shopify/hydrogen';

import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {PageHeader, ProductGrid, Section, Text} from '~/components';
import {NotFound, Layout} from '~/components/index.server';
import {Filters} from '~/components/elements/Filter';

const pageBy = 48;

export default function Filter({params, search}: HydrogenRouteProps) {
  const {handle} = params;
  const {
    language: {isoCode: language},
    country: {isoCode: country},
  } = useLocalization();
  search = search.substring(1).split('=')[1];
  console.log('Search:::', search);
  const {
    data: {collection},
  } = useShopQuery({
    query: COLLECTION_FILTER_QUERY,
    variables: {
      handle,
      language,
      country,
      pageBy,
      type: search,
    },
    preload: false,
  });

  if (!collection) {
    return <NotFound type="collection" />;
  }

  useServerAnalytics({
    shopify: {
      canonicalPath: `/collections/${handle}`,
      pageType: ShopifyAnalyticsConstants.pageType.collection,
      resourceId: collection.id,
      collectionHandle: handle,
    },
  });
  const productsTypes = collection.products.nodes.map(
    (el: {productType: string}) => el.productType,
  );
  const uniqueProductTypes = [...new Set(productsTypes)];
  // console.log('collection::::::', collection);
  // console.log("collection.products.nodes::::::", collection.products.nodes)
  //  console.log(uniqueProductTypes);
  //  console.log('SEARCH IN FILTER', search, 'PARAMS IN FILTER', params);
  return (
    <Layout>
      <Suspense>
        <Seo type="collection" data={collection} />
      </Suspense>
      <PageHeader heading={collection.title}>
        {collection?.description && (
          <div className="flex items-baseline justify-between w-full">
            <div>
              <Text format width="narrow" as="p" className="inline-block">
                {collection.description}
              </Text>
            </div>
          </div>
        )}
      </PageHeader>
      <Section>
        <ProductGrid
          key={collection.id}
          collection={collection}
          url={`/collections/${handle}?country=${country}`}
        />
      </Section>
      <Section>
        <Filters uniqueProductTypes={uniqueProductTypes} handle={handle} />
      </Section>
    </Layout>
  );
}

// API endpoint that returns paginated products for this collection
// @see templates/demo-store/src/components/product/ProductGrid.client.tsx
// export async function api(
//   request: HydrogenRequest,
//   {params, queryShop}: HydrogenApiRouteOptions,
// ) {
//   if (request.method !== 'POST') {
//     return new Response('Method not allowed', {
//       status: 405,
//       headers: {Allow: 'POST'},
//     });
//   }
//   const url = new URL(request.url);

//   const cursor = url.searchParams.get('cursor');
//   const country = url.searchParams.get('country');
//   const {handle} = params;

//   return await queryShop({
//     query: PAGINATE_COLLECTION_QUERY,
//     variables: {
//       handle,
//       cursor,
//       pageBy,
//       country,
//     },
//   });
// }

const COLLECTION_FILTER_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
    $cursor: String
    $type: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(
        first: $pageBy
        after: $cursor
        filters: {productType: $type} # filters:{ #   productMetafield:{ #     namespace:"custom", #     key:"product_intro_line", #     value:"women's clothing" #   } # }
      ) {
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

// const PAGINATE_COLLECTION_QUERY = gql`
//   ${PRODUCT_CARD_FRAGMENT}
//   query CollectionPage(
//     $handle: String!
//     $pageBy: Int!
//     $cursor: String
//     $country: CountryCode
//     $language: LanguageCode
//   ) @inContext(country: $country, language: $language) {
//     collection(handle: $handle) {
//       products(first: $pageBy, after: $cursor) {
//         nodes {
//           ...ProductCard
//         }
//         pageInfo {
//           hasNextPage
//           endCursor
//         }
//       }
//     }
//   }
// `;
