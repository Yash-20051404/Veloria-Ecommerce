export const orders = [
  { id: '#ORD12345', customer: 'Priya Sharma', email: 'priya.sharma@email.com', amount: 68999, items: 3, payment: 'Paid', status: 'Processing', date: '24 May 2025', time: '10:30 AM' },
  { id: '#ORD12344', customer: 'Aman Verma', email: 'aman.verma@email.com', amount: 24999, items: 2, payment: 'Paid', status: 'Confirmed', date: '24 May 2025', time: '09:15 AM' },
  { id: '#ORD12343', customer: 'Neha Kapoor', email: 'neha.kapoor@email.com', amount: 59999, items: 4, payment: 'Paid', status: 'Shipped', date: '23 May 2025', time: '08:45 PM' },
  { id: '#ORD12342', customer: 'Ritik Malhotra', email: 'ritik.malhotra@email.com', amount: 79999, items: 1, payment: 'Paid', status: 'Out for Delivery', date: '23 May 2025', time: '02:20 PM' },
  { id: '#ORD12341', customer: 'Simran Kaur', email: 'simran.kaur@email.com', amount: 49999, items: 2, payment: 'Paid', status: 'Delivered', date: '22 May 2025', time: '11:05 AM' },
  { id: '#ORD12340', customer: 'Vivek Singh', email: 'vivek.singh@email.com', amount: 34999, items: 2, payment: 'Paid', status: 'Cancelled', date: '22 May 2025', time: '09:30 AM' },
  { id: '#ORD12339', customer: 'Ananya Patel', email: 'ananya.patel@email.com', amount: 89999, items: 3, payment: 'Refunded', status: 'Refunded', date: '21 May 2025', time: '07:40 PM' },
  { id: '#ORD12338', customer: 'Diya Shah', email: 'diya.shah@email.com', amount: 44999, items: 1, payment: 'Paid', status: 'Delivered', date: '21 May 2025', time: '04:15 PM' },
  { id: '#ORD12337', customer: 'Karan Mehta', email: 'karan.mehta@email.com', amount: 99999, items: 2, payment: 'Paid', status: 'Shipped', date: '20 May 2025', time: '01:30 PM' },
  { id: '#ORD12336', customer: 'Pooja Nair', email: 'pooja.nair@email.com', amount: 29999, items: 1, payment: 'Pending', status: 'Processing', date: '20 May 2025', time: '10:00 AM' },
];

export const products = [
  { id: 1, name: 'Royal Emerald Ring', sku: 'VR-RNG-001', category: 'Rings', price: 79999, stock: 12, status: 'Active', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=80&h=80&fit=crop', created: '24 May 2025' },
  { id: 2, name: 'Diamond Pendant', sku: 'VR-PDN-002', category: 'Pendants', price: 49999, stock: 8, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=80&h=80&fit=crop', created: '24 May 2025' },
  { id: 3, name: 'Classic Tennis Bracelet', sku: 'VR-BRC-003', category: 'Bracelets', price: 59999, stock: 15, status: 'Active', image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=80&h=80&fit=crop', created: '23 May 2025' },
  { id: 4, name: 'Golden Stud Earrings', sku: 'VR-EAR-004', category: 'Earrings', price: 24999, stock: 20, status: 'Active', image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=80&h=80&fit=crop', created: '23 May 2025' },
  { id: 5, name: 'Rose Gold Bangle', sku: 'VR-BAN-005', category: 'Bangles', price: 69999, stock: 7, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=80&h=80&fit=crop', created: '22 May 2025' },
  { id: 6, name: 'Sapphire Necklace', sku: 'VR-NCK-006', category: 'Necklaces', price: 124999, stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=80&h=80&fit=crop', created: '22 May 2025' },
  { id: 7, name: 'Pearl Drop Earrings', sku: 'VR-EAR-007', category: 'Earrings', price: 18999, stock: 25, status: 'Active', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=80&h=80&fit=crop', created: '21 May 2025' },
  { id: 8, name: 'Gold Chain Necklace', sku: 'VR-NCK-008', category: 'Necklaces', price: 89999, stock: 5, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1599459182681-c938b7f65369?w=80&h=80&fit=crop', created: '21 May 2025' },
];

export const customers = [
  { id: 1, name: 'Priya Sharma', email: 'priya.sharma@email.com', phone: '+91 98765 43210', orders: 8, totalSpent: 125890, memberSince: '24 May 2025', status: 'Active', initials: 'PS', color: '#D6B57A' },
  { id: 2, name: 'Aman Verma', email: 'aman.verma@email.com', phone: '+91 91234 56789', orders: 5, totalSpent: 89990, memberSince: '24 May 2025', status: 'Active', initials: 'AV', color: '#7ABFD6' },
  { id: 3, name: 'Neha Kapoor', email: 'neha.kapoor@email.com', phone: '+91 99887 66554', orders: 12, totalSpent: 245670, memberSince: '23 May 2025', status: 'Active', initials: 'NK', color: '#D67A7A' },
  { id: 4, name: 'Ritik Malhotra', email: 'ritik.malhotra@email.com', phone: '+91 90909 12345', orders: 3, totalSpent: 45999, memberSince: '23 May 2025', status: 'Active', initials: 'RM', color: '#7AD6A3' },
  { id: 5, name: 'Simran Kaur', email: 'simran.kaur@email.com', phone: '+91 87654 32109', orders: 7, totalSpent: 105450, memberSince: '22 May 2025', status: 'Active', initials: 'SK', color: '#B57AD6' },
  { id: 6, name: 'Vivek Singh', email: 'vivek.singh@email.com', phone: '+91 78945 61230', orders: 2, totalSpent: 32990, memberSince: '22 May 2025', status: 'Inactive', initials: 'VS', color: '#D6A87A' },
  { id: 7, name: 'Ananya Patel', email: 'ananya.patel@email.com', phone: '+91 65432 10987', orders: 9, totalSpent: 189900, memberSince: '21 May 2025', status: 'Active', initials: 'AP', color: '#7A9BD6' },
  { id: 8, name: 'Diya Shah', email: 'diya.shah@email.com', phone: '+91 54321 09876', orders: 4, totalSpent: 67500, memberSince: '21 May 2025', status: 'Active', initials: 'DS', color: '#D67AAF' },
];

export const coupons = [
  { id: 1, code: 'VELORIA10', description: 'Flat 10% off on all orders', discount: '10% OFF', minOrder: 2000, expiry: '30 Jun 2025', limit: 500, used: 245, status: 'Active' },
  { id: 2, code: 'WELCOME15', description: '15% off for first time users', discount: '15% OFF', minOrder: 3000, expiry: '15 Jul 2025', limit: 300, used: 123, status: 'Active' },
  { id: 3, code: 'LUXURY20', description: '20% off on orders above ₹10,000', discount: '20% OFF', minOrder: 10000, expiry: '10 Jun 2025', limit: 200, used: 87, status: 'Active' },
  { id: 4, code: 'FREESHIP', description: 'Free shipping on all orders', discount: 'Free Shipping', minOrder: 0, expiry: '31 Dec 2025', limit: -1, used: 312, status: 'Active' },
  { id: 5, code: 'VELORIA5', description: 'Flat 5% off on all orders', discount: '5% OFF', minOrder: 1500, expiry: '20 May 2025', limit: 500, used: 500, status: 'Expired' },
  { id: 6, code: 'DIWALI25', description: '25% off on festive collection', discount: '25% OFF', minOrder: 5000, expiry: '05 Nov 2024', limit: 250, used: 250, status: 'Expired' },
  { id: 7, code: 'SUMMER10', description: 'Summer special 10% off', discount: '10% OFF', minOrder: 2500, expiry: '31 Aug 2025', limit: 400, used: 56, status: 'Active' },
  { id: 8, code: 'NEWUSER20', description: '20% off for new users', discount: '20% OFF', minOrder: 1000, expiry: '31 Dec 2025', limit: 1000, used: 234, status: 'Active' },
];

export const reviews = [
  { id: 1, customer: 'Priya Sharma', initials: 'PS', color: '#D6B57A', product: 'Royal Emerald Ring', rating: 5, review: 'Absolutely stunning! The craftsmanship is impeccable.', date: '24 May 2025', status: 'Approved' },
  { id: 2, customer: 'Aman Verma', initials: 'AV', color: '#7ABFD6', product: 'Diamond Pendant', rating: 4, review: 'Beautiful pendant, my wife loved it. Fast delivery.', date: '23 May 2025', status: 'Approved' },
  { id: 3, customer: 'Neha Kapoor', initials: 'NK', color: '#D67A7A', product: 'Classic Tennis Bracelet', rating: 5, review: 'Worth every rupee! Exquisite quality.', date: '22 May 2025', status: 'Pending' },
  { id: 4, customer: 'Ritik Malhotra', initials: 'RM', color: '#7AD6A3', product: 'Golden Stud Earrings', rating: 3, review: 'Good quality but delivery was delayed by 2 days.', date: '21 May 2025', status: 'Pending' },
  { id: 5, customer: 'Simran Kaur', initials: 'SK', color: '#B57AD6', product: 'Rose Gold Bangle', rating: 5, review: 'Perfect gift for my anniversary. Packaging was luxurious.', date: '20 May 2025', status: 'Approved' },
  { id: 6, customer: 'Vivek Singh', initials: 'VS', color: '#D6A87A', product: 'Sapphire Necklace', rating: 2, review: 'The stone color was different from the website image.', date: '19 May 2025', status: 'Rejected' },
  { id: 7, customer: 'Ananya Patel', initials: 'AP', color: '#7A9BD6', product: 'Pearl Drop Earrings', rating: 5, review: 'Elegant and timeless. Exactly as described.', date: '18 May 2025', status: 'Approved' },
  { id: 8, customer: 'Diya Shah', initials: 'DS', color: '#D67AAF', product: 'Gold Chain Necklace', rating: 4, review: 'Good quality gold, sturdy clasp. Happy with purchase.', date: '17 May 2025', status: 'Pending' },
];

export const salesData = [
  { date: '24 May', revenue: 68000 },
  { date: '28 May', revenue: 85000 },
  { date: '1 Jun', revenue: 92000 },
  { date: '5 Jun', revenue: 130000 },
  { date: '9 Jun', revenue: 105000 },
  { date: '13 Jun', revenue: 118000 },
  { date: '17 Jun', revenue: 110000 },
  { date: '21 Jun', revenue: 145000 },
  { date: '24 Jun', revenue: 148000 },
];

export const categoryData = [
  { name: 'Rings', value: 35 },
  { name: 'Necklaces', value: 25 },
  { name: 'Earrings', value: 20 },
  { name: 'Bracelets', value: 12 },
  { name: 'Bangles', value: 8 },
];

export const monthlyOrders = [
  { month: 'Jan', orders: 28 },
  { month: 'Feb', orders: 35 },
  { month: 'Mar', orders: 42 },
  { month: 'Apr', orders: 38 },
  { month: 'May', orders: 55 },
  { month: 'Jun', orders: 48 },
  { month: 'Jul', orders: 62 },
  { month: 'Aug', orders: 58 },
  { month: 'Sep', orders: 70 },
  { month: 'Oct', orders: 65 },
  { month: 'Nov', orders: 85 },
  { month: 'Dec', orders: 90 },
];

export const topProducts = [
  { name: 'Royal Emerald Ring', sales: 145, revenue: 11599855 },
  { name: 'Diamond Pendant', sales: 128, revenue: 6399872 },
  { name: 'Classic Tennis Bracelet', sales: 112, revenue: 6719888 },
  { name: 'Golden Stud Earrings', sales: 98, revenue: 2449902 },
  { name: 'Rose Gold Bangle', sales: 87, revenue: 6089913 },
];
