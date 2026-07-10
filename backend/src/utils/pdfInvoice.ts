import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { IOrder } from '../models/Order';

export const generateInvoicePDF = (order: IOrder, res: Response) => {
  // Initialize PDF Document
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Set response headers to trigger download in browser
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="Veloria-Invoice-${order.orderId}.pdf"`);

  // Pipe the PDF directly to the HTTP response
  doc.pipe(res);

  const primaryColor = '#050505';
  const accentColor = '#D6B57A';
  const grayColor = '#888888';

  // Header
  doc.fillColor(accentColor)
     .fontSize(24)
     .font('Helvetica-Bold')
     .text('VELORIA', 50, 45);

  doc.fillColor(grayColor)
     .fontSize(10)
     .font('Helvetica')
     .text('Maison De Luxury', 50, 75);

  doc.fillColor(primaryColor)
     .fontSize(10)
     .text('123 Luxury Avenue', 200, 50, { align: 'right' })
     .text('Mumbai, India 400001', 200, 65, { align: 'right' })
     .text('contact@veloria.com', 200, 80, { align: 'right' });

  doc.strokeColor(accentColor).lineWidth(1).moveTo(50, 110).lineTo(545, 110).stroke();

  // Order Information
  doc.fillColor(primaryColor).fontSize(12).font('Helvetica-Bold').text('INVOICE', 50, 130);
  doc.font('Helvetica').fontSize(10);
  doc.text(`Order Number: ${order.orderId}`, 50, 155);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 50, 170);
  doc.text(`Payment Status: ${order.paymentStatus}`, 50, 185);

  // Billed To
  doc.font('Helvetica-Bold').text('Billed To:', 350, 130);
  doc.font('Helvetica');
  doc.text(order.customerName, 350, 155);
  doc.text(order.email, 350, 170);
  if (order.phone) doc.text(order.phone, 350, 185);

  // Table Header
  const tableTop = 240;
  doc.font('Helvetica-Bold').fillColor(primaryColor);
  doc.text('Item Description', 50, tableTop);
  doc.text('Qty', 350, tableTop, { width: 50, align: 'center' });
  doc.text('Price', 400, tableTop, { width: 70, align: 'right' });
  doc.text('Total', 480, tableTop, { width: 65, align: 'right' });
  doc.strokeColor(grayColor).lineWidth(0.5).moveTo(50, tableTop + 15).lineTo(545, tableTop + 15).stroke();

  // Table Rows
  let y = tableTop + 25;
  doc.font('Helvetica').fillColor(primaryColor);
  (order.items || []).forEach(item => {
    const itemPrice = Number(item.price) || 0;
    const lineTotal = itemPrice * (item.quantity || 1);
    doc.text(item.name || 'Veloria Creation', 50, y, { width: 280 });
    doc.text((item.quantity || 1).toString(), 350, y, { width: 50, align: 'center' });
    doc.text(`Rs. ${itemPrice.toLocaleString('en-IN')}`, 400, y, { width: 70, align: 'right' });
    doc.text(`Rs. ${lineTotal.toLocaleString('en-IN')}`, 480, y, { width: 65, align: 'right' });
    y += 25;
  });

  doc.strokeColor(grayColor).moveTo(50, y + 10).lineTo(545, y + 10).stroke();
  doc.font('Helvetica-Bold').fontSize(14).fillColor(accentColor).text('Grand Total:', 350, y + 30);
  doc.text(`Rs. ${(order.amount || 0).toLocaleString('en-IN')}`, 430, y + 30, { width: 115, align: 'right' });
  doc.font('Helvetica').fontSize(10).fillColor(grayColor).text('Thank you for choosing Veloria. For any assistance,', 50, 700, { align: 'center' });
  doc.text('please contact our Maison Concierge at support@veloria.com.', 50, 715, { align: 'center' });
  doc.end();
};