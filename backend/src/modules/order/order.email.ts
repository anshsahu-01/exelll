type OrderEmailContext = {
  productName: string;
  orderUrl: string;
  orderDate?: string;
  buyerName?: string;
  buyerCollege?: string | null;
  sellerName?: string;
  buyerPhone?: string | null;
  rejectionReason?: string | null;
};

function baseShell(title: string, body: string) {
  return `
    <div style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;color:#111827">
      <div style="max-width:600px;margin:0 auto;padding:24px">
        <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:20px;padding:28px">
          <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6b7280;margin-bottom:12px">Exell</div>
          <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3">${title}</h1>
          ${body}
        </div>
      </div>
    </div>
  `;
}

function button(url: string, label: string) {
  return `
    <a href="${url}" style="display:inline-block;margin-top:20px;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:999px;font-size:14px;font-weight:700">
      ${label}
    </a>
  `;
}

export function buildNewOrderEmail(context: OrderEmailContext) {
  return baseShell(
    "New Order Request Received",
    `
      <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#374151">You have received a new order request for <strong>${context.productName}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#374151">
        <tr><td style="padding:8px 0;color:#6b7280">Buyer</td><td style="padding:8px 0;text-align:right;font-weight:700">${context.buyerName ?? "-"}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Buyer College</td><td style="padding:8px 0;text-align:right;font-weight:700">${context.buyerCollege ?? "-"}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7280">Order Date</td><td style="padding:8px 0;text-align:right;font-weight:700">${context.orderDate}</td></tr>
      </table>
      ${button(context.orderUrl, "View Order")}
    `
  );
}

export function buildAcceptedOrderEmail(context: OrderEmailContext) {
  return baseShell(
    "Your Order Has Been Accepted",
    `
      <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#374151">Good news. Your order for <strong>${context.productName}</strong> has been accepted by <strong>${context.sellerName ?? "the seller"}</strong>.</p>
      <p style="margin:0;color:#374151;font-size:15px;line-height:1.7">Please open your order details for the latest status and contact information.</p>
      ${button(context.orderUrl, "View Order Details")}
    `
  );
}

export function buildRejectedOrderEmail(context: OrderEmailContext) {
  return baseShell(
    "Order Request Update",
    `
      <p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:#374151">Your order request for <strong>${context.productName}</strong> was rejected by <strong>${context.sellerName ?? "the seller"}</strong>.</p>
      <p style="margin:0 0 12px;color:#374151;font-size:15px;line-height:1.7"><strong>Rejection reason:</strong> ${context.rejectionReason ?? "Not provided"}</p>
      ${button(context.orderUrl, "View Order Details")}
    `
  );
}
