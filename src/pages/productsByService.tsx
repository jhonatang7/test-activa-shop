import Grid from '@/components/product/grid';
import { usePopularProducts, useProductsByService } from '@/data/product';
import Layout from '@/layouts/_layout';
import { NextPageWithLayout } from '@/types';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-use';
import { string } from 'yup';

type ParsedQueryParams = {
  tagSlug: string;
};

function Products() {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const idParams = search.get('id');
  const id = idParams ? parseInt(idParams, 10) : NaN;

  const { productsByService, isLoading } = useProductsByService(id);
  //   if (isLoading) {
  //     return <div>Not found</div>;
  //   }

  return (
    <>
      <Grid
        products={productsByService}
        hasNextPage={false}
        isLoadingMore={false}
        isLoading={isLoading}
      />
    </>
  );
}

const ProductsByService: NextPageWithLayout = () => {
  return (
    <>
      <Products />
    </>
  );
};

ProductsByService.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ProductsByService;
