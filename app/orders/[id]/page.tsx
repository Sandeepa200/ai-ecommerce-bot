import OrderStatusClient from "@/components/OrderStatusClient";

export default async function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderStatusClient id={id} />;
}