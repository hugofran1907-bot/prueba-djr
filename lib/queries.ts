/**
 * Consultas GraphQL para la Shopify Storefront API.
 * Solo las usa lib/shopify.ts cuando USE_MOCK_DATA=false.
 */

const imageFragment = /* GraphQL */ `
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
`;

const productFragment = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    availableForSale
    tags
    productType
    createdAt
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    featuredImage { ...ImageFields }
    images(first: 10) {
      edges { node { ...ImageFields } }
    }
    media(first: 10) {
      nodes {
        mediaContentType
        ... on Video {
          sources { url mimeType }
          previewImage { ...ImageFields }
        }
      }
    }
    options {
      id
      name
      optionValues {
        name
        swatch { color }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions { name value }
          price { amount currencyCode }
          # Requiere el permiso unauthenticated_read_product_inventory; si no, devuelve null.
          quantityAvailable
          image { ...ImageFields }
        }
      }
    }
    seo { title description }
    collections(first: 1) {
      nodes { handle title }
    }
    # Metacampos de producto (namespace "custom"). Créalos en Shopify > Ajustes > Metacampos.
    details: metafields(
      identifiers: [
        { namespace: "custom", key: "beneficio" }
        { namespace: "custom", key: "detalle" }
        { namespace: "custom", key: "uso" }
        { namespace: "custom", key: "cuidados" }
        { namespace: "custom", key: "materiales" }
        { namespace: "custom", key: "fit" }
      ]
    ) {
      key
      value
    }
    # Metacampo tipo "lista de referencias de producto".
    completeTheLook: metafield(namespace: "custom", key: "completa_el_look") {
      references(first: 4) {
        nodes { ... on Product { handle } }
      }
    }
  }
  ${imageFragment}
`;

const collectionFragment = /* GraphQL */ `
  fragment CollectionFields on Collection {
    id
    handle
    title
    description
    image { ...ImageFields }
    seo { title description }
  }
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts($first: Int!, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      edges { node { ...ProductFields } }
    }
  }
  ${productFragment}
`;

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) { ...ProductFields }
  }
  ${productFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges { node { ...CollectionFields } }
    }
  }
  ${collectionFragment}
  ${imageFragment}
`;

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String!) {
    collection(handle: $handle) { ...CollectionFields }
  }
  ${collectionFragment}
  ${imageFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $first: Int!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      products(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges { node { ...ProductFields } }
      }
    }
  }
  ${productFragment}
`;

export const createCartMutation = /* GraphQL */ `
  mutation createCart($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { checkoutUrl }
      userErrors { field message }
    }
  }
`;
