import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import numWords from "num-words";
import NotoSans, { registerFont } from "../Components/Assets/fonts/NotoSansLoader";

export const downloadInvoice = (order) => {
  const { items, discount, grandTotal } = order;
  const img = new Image();
  img.src = "/logo.png";
  img.onload = () => {
    const doc = new jsPDF();
    registerFont(doc);
    doc.setFont("NotoSans");
  
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.addImage(img, "PNG", 50, 80, 100, 100);
  
    doc.setGState(new doc.GState({ opacity: 1 }));
    
  const generateOrderId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const invoiceId = generateOrderId();
  const invoiceDate = new Date().toLocaleDateString();
  console.log(doc.getFontList());

  // Logo & title
  const logoPath = "/logo.png";
  doc.addImage(logoPath, "PNG", 85, 10, 40, 20);
  doc.setFontSize(15);
  doc.text("LivreLuxe", 105, 35, { align: "center" });
  doc.setFontSize(14);
  doc.text("Tax Invoice", 105, 45, { align: "center" });

  // Order info
  doc.setFontSize(11);
  doc.text(`Order ID: ${invoiceId}`, 15, 60);
  doc.text(`Date: ${invoiceDate}`, 160, 60);

  // Table rows
  const tableBody = items.map((item, idx) => {
    const price = item.price;
    const quantity = item.quantity;
    const tax = +(price * quantity * 0.14).toFixed(2);
    return [
      idx + 1,
      item.name,
      quantity,
      `₹ ${price}`,
      discount ? `₹ ${discount}` : "–",
      `₹ ${tax}`,
      `₹ ${grandTotal}`
    ];
  });

  // Table
  autoTable(doc, {
    head: [["Sr. No.", "Name", "Quantity", "Price", "Discount", "Tax", "Total"]],
    body: tableBody,
    styles: {
    font: "NotoSans",
    fontStyle: "normal",
    fontSize: 10
  },
    startY: 70
  });

  // Total in words using num-words
  const totalInWords = numWords(Math.round(grandTotal));
  const capitalized = totalInWords.charAt(0).toUpperCase() + totalInWords.slice(1);

  doc.text(`Total (in words): ${capitalized} rupees only.`, 15, doc.lastAutoTable.finalY + 15);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    "Thank you for shopping with LivreLuxe! For any queries, contact support@livreluxe.com",
    105,
    285,
    { align: "center" }
  );

  doc.save(`Invoice_${invoiceId}.pdf`);
}};