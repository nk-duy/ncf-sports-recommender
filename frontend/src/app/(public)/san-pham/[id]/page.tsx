import ProductDetailView from '@/modules/public/san-pham/components/ProductDetailView';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailView id={id} />;
}
