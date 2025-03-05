import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import styled from 'styled-components';
import DisplayError from './ErrorMessage';

const ProductStyles = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  max-width: var(--maxWidth);
  justify-content: center;
  align-items: center;
  gap: 2rem;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    items: Product(where: { id: $id }) {
      name
      description
      price
      id
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function SingleProduct({ id }) {
  const { data, loading, error } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: {
      id,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { items } = data;
  return (
    <ProductStyles>
      <Head>
        <title> Sick Fits | {items.name} </title>
      </Head>
      <img
        src={items.photo.image.publicUrlTransformed}
        alt={items.photo.altText}
      />
      <div className="details">
        <h2>{items.name}</h2>
        <p>{items.description}</p>
      </div>
    </ProductStyles>
  );
}
