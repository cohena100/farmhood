export interface OrderFeedbackProps {
  params: { orderId: string };
}

export default function OrderFeedbackPage({
  params: { orderId },
}: OrderFeedbackProps) {
  return (<div>{orderId} aaaaa</div>);
}
