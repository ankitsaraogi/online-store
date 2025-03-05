import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells Apollo we will take care of everything
    read(existing = [], { args, cache }) {
      // First thing it does it asks the read function for those items
      // We can either do one of two things
      // First thing we can do is return the items because they are already in the cache
      // The other thing we can do is to return false from here, (network request)

      const { skip, first } = args;
      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      /**
       * If there are are items && there aren't enough items to satisfy how many we request
       * && we are on the last page
       * Then just send it
       */
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        // we dont have any item and need to go to network to fetch them
        return false;
      }
      if (items.length) {
        // There are items in the cache! and gonna send them to apollo
        return items;
      }

      return false;
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // This runs when Apollo client comes back from the network with our items
      console.log(`Merging items from the network ${incoming.length}`);

      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; i += 1) {
        merged[i] = incoming[i - skip];
      }

      console.log(merged);
      // Finally we return the merged items from the cache
      return merged;
    },
  };
}
