import { useState, useEffect, memo, useMemo } from 'react'
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CheckCircle, ShieldCheck, Lock, Truck, ArrowRight, Sparkles, User
} from 'lucide-react'
import { useCartStore, type CartItem } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useCouponStore } from '@/store/couponStore'
import { useBuyerStore } from '@/store/buyerStore'
// @ts-ignore
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

// ──────────────── TYPOGRAPHY & CONSTANTS ────────────────

const cormorant = { fontFamily: "'Cormorant Garamond', serif" } as const
const inter = { fontFamily: 'Inter, system-ui, -apple-system, sans-serif' } as const

// ──────────────── MOCK DATA ────────────────

const parsePrice = (price: string | number) => {
  const num = typeof price === 'number' ? price : Number(String(price || 0).replace(/[^0-9.-]+/g, ''))
  return isNaN(num) ? 0 : num
}
const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

// ──────────────── REUSABLE UI COMPONENTS ────────────────

const LuxuryInput = memo(({ label, type = "text", required = false, className = "", ...props }: any) => (
  <div className={`relative w-full ${className}`}>
    <input
      type={type}
      required={required}
      className="peer block w-full appearance-none border-b border-white/20 bg-transparent px-0 py-4 text-sm text-white focus:border-[#D6B57A] focus:outline-none focus:ring-0"
      placeholder=" "
      {...props}
    />
    <label className="absolute top-4 -z-10 origin-[0] -translate-y-6 scale-75 transform text-[10px] uppercase tracking-widest text-white/50 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#D6B57A]">
      {label} {required && <span className="text-[#D6B57A]">*</span>}
    </label>
  </div>
))

const PaymentNavbar = memo(() => {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuthStore()
  return (
    <nav className="sticky top-0 z-[200] border-b border-white/10 bg-[#030303]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5 lg:px-0">
        <button onClick={() => navigate('/')} className="text-2xl tracking-[0.3em] text-white transition-colors hover:text-[#D6B57A]" style={cormorant}>VELORIA</button>
        <div className="flex items-center gap-2 text-[#D6B57A]/80 text-[10px] uppercase tracking-widest" style={inter}>
          <ShieldCheck className="h-4 w-4" />
          <span className="hidden sm:inline-block">256-Bit Encrypted Checkout</span>
          <div className="ml-4 h-3 w-px bg-[#D6B57A]/30" />
          <button 
            onClick={() => navigate(isAuthenticated && role ? `/${role.toLowerCase()}` : '/login')}
            className="ml-4 transition-all hover:scale-110 hover:text-white"
          >
            <User className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </nav>
  )
})

const ProgressTracker = memo(() => (
  <div className="mb-12 flex items-center gap-4 text-[9px] uppercase tracking-[0.25em] md:text-[10px]" style={inter}>
    <span className="text-white/60 flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-[#D6B57A]"/> Cart</span>
    <div className="h-[1px] flex-1 bg-white/10" />
    <span className="text-white/60 flex items-center gap-1.5"><CheckCircle className="h-3 w-3 text-[#D6B57A]"/> Address</span>
    <div className="relative h-[1px] flex-1 overflow-hidden bg-white/10">
      <motion.div 
        initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1, ease: 'easeOut' }} 
        className="absolute inset-0 bg-[#D6B57A]" 
      />
    </div>
    <span className="text-[#D6B57A]">● Payment</span>
  </div>
))

const SkeletonLoader = memo(() => (
  <div className="animate-pulse">
    <div className="h-4 w-64 bg-white/10 mb-12" />
    <div className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-16">
      <div className="space-y-12">
        <div className="h-10 w-48 bg-white/10" />
        <div className="space-y-4">
          <div className="h-20 w-full bg-white/5" />
          <div className="h-20 w-full bg-white/5" />
          <div className="h-20 w-full bg-white/5" />
        </div>
        <div className="h-64 w-full bg-white/5" />
      </div>
      <div>
        <div className="h-[600px] w-full bg-white/5" />
      </div>
    </div>
  </div>
))

// ──────────────── PAYMENT SECTIONS ────────────────

const PaymentMethodCard = memo(({ 
  id, title, icon: Icon, selected, onSelect 
}: { 
  id: string, title: string, icon: any, selected: boolean, onSelect: (id: string) => void 
}) => {
  return (
    <div
      onClick={() => onSelect(id)}
      className={`group relative cursor-pointer border p-6 transition-all duration-500 hover:-translate-y-1 ${
        selected 
          ? 'border-[#D6B57A] bg-[#D6B57A]/5 shadow-[0_0_20px_rgba(214,181,122,0.15)]' 
          : 'border-white/10 bg-[#050505] hover:border-white/30'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${selected ? 'border-[#D6B57A] bg-[#D6B57A]/10 text-[#D6B57A]' : 'border-white/10 text-white/40 group-hover:text-white'}`}>
            <Icon className="h-4 w-4" />
          </div>
          <p className={`text-sm tracking-wide ${selected ? 'text-[#D6B57A]' : 'text-white'}`} style={inter}>{title}</p>
        </div>
        {selected && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D6B57A]">
            <CheckCircle className="h-3 w-3 text-black" />
          </motion.div>
        )}
      </div>
    </div>
  )
})


const DeliveryVerification = memo(({ address }: { address?: any }) => (
  <div className="mt-10 rounded-2xl border border-[#D6B57A]/20 bg-[#D6B57A]/5 p-8">
    <p className="text-[10px] uppercase tracking-[0.25em] text-[#D6B57A]" style={inter}>
      Delivery Destination
    </p>

    <div className="mt-6 space-y-2">
      <h3 className="text-2xl text-white" style={cormorant}>{address?.fullName || 'Guest User'}</h3>
      <p className="text-white/70" style={inter}>{address?.phone || '+91 0000000000'}</p>
      <p className="text-white/60 leading-7" style={inter}>
        {address?.addressLine1 || 'No Address Provided'}<br />
        {address?.addressLine2 && <>{address.addressLine2}<br /></>}
        {address?.city}, {address?.state} {address?.pincode}<br />
        {address?.country || 'India'}
      </p>
    </div>

    <div className="mt-6 border-t border-white/10 pt-6">
      <p className="text-xs text-white/60 leading-7" style={inter}>
        Your Veloria creation will be delivered to the address above.
        Please verify the information before proceeding with secure payment.
      </p>
    </div>
  </div>
))

const AvailablePaymentMethods = memo(() => (
  <div className="mt-10 rounded-2xl border border-white/10 bg-[#050505] p-8">
    <p className="text-[10px] uppercase tracking-[0.25em] text-[#D6B57A]" style={inter}>
      Available Payment Methods
    </p>
    <p
  className="mt-3 text-xs leading-7 text-white/50"
  style={inter}
>
  Secure checkout powered by Razorpay. All payment options will be available after proceeding to payment.
</p>

    <div className="mt-8 grid gap-4">
      <div className="mt-8 grid gap-4">
  {[
    {
      title: 'UPI',
      desc: 'Google Pay, PhonePe, Paytm, BHIM',
    },
    {
      title: 'Credit & Debit Cards',
      desc: 'Visa, Mastercard, RuPay, Amex',
    },
    {
      title: 'Net Banking',
      desc: 'All Major Indian Banks',
    },
    {
      title: 'Wallets',
      desc: 'Paytm Wallet & More',
    },
    {
      title: 'EMI Options',
      desc: 'Eligible Banks & Cards',
    },
  ].map((method) => (
    <div
      key={method.title}
      className="group flex items-center justify-between rounded-xl border border-white/10 bg-gradient-to-r from-[#050505] to-[#0A0A0A] px-6 py-5 transition-all duration-500 hover:border-[#D6B57A]/40 hover:bg-[#D6B57A]/5"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
        </div>

        <div>
          <p
            className="text-sm text-white"
            style={inter}
          >
            {method.title}
          </p>

          <p
            className="mt-1 text-[10px] uppercase tracking-widest text-white/40"
            style={inter}
          >
            {method.desc}
          </p>
        </div>
      </div>

      <span
        className="text-[10px] uppercase tracking-[0.2em] text-[#D6B57A]"
        style={inter}
      >
        Available
      </span>
    </div>
  ))}
</div>
    </div>
  </div>
))

const TrustBadges = memo(() => (
  <div className="mt-16 group relative overflow-hidden rounded-2xl border border-[#D6B57A]/20 bg-[#D6B57A]/5 p-8">
    <motion.div 
      className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(214,181,122,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" 
    />
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
      <div className="flex flex-col items-center md:items-start gap-2">
        <Lock className="h-6 w-6 text-[#D6B57A]" />
        <h5 className="text-sm font-light text-white" style={cormorant}>PCI DSS Compliant</h5>
        <p className="text-[10px] uppercase tracking-widest text-white/40" style={inter}>Highest security standard</p>
      </div>
      <div className="hidden md:block h-12 w-px bg-white/10" />
      <div className="flex flex-col items-center md:items-start gap-2">
        <ShieldCheck className="h-6 w-6 text-[#D6B57A]" />
        <h5 className="text-sm font-light text-white" style={cormorant}>Bank Grade Security</h5>
        <p className="text-[10px] uppercase tracking-widest text-white/40" style={inter}>256-bit encryption</p>
      </div>
      <div className="hidden md:block h-12 w-px bg-white/10" />
      <div className="flex flex-col items-center md:items-start gap-2">
        <Sparkles className="h-6 w-6 text-[#D6B57A]" />
        <h5 className="text-sm font-light text-white" style={cormorant}>Fraud Protection</h5>
        <p className="text-[10px] uppercase tracking-widest text-white/40" style={inter}>Zero liability included</p>
      </div>
    </div>
    
  </div>
  
))



const OrderSummary = memo(({ 
  subtotal, finalTotal, items, discountType, discountValue 
}: { 
  subtotal: number, finalTotal: number, items: CartItem[], discountType: string, discountValue: number 
}) => {
  const safeDiscountValue = Number(discountValue) || 0;
  const discountAmount = discountType === 'percentage' ? subtotal * (safeDiscountValue / 100) : safeDiscountValue;
  return (
    <div className="sticky top-32 flex flex-col gap-8">
      <div className="rounded-2xl border border-white/10 bg-[#050505] p-8">
        <h2 className="text-2xl text-white mb-8" style={cormorant}>Order Summary</h2>
        
        <div className="mb-8 flex flex-col gap-6 border-b border-white/10 pb-8">
          {(Array.isArray(items) ? items : []).map((item, idx) => (
            <div key={item?.id || idx} className="flex gap-4">
              <div className="relative h-20 w-16 shrink-0 bg-black border border-white/5">
                <img src={item?.image} alt={item?.name} className="h-full w-full object-cover opacity-80" />
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 border border-white/20 text-[9px] text-white backdrop-blur-md">
                  {item?.quantity}
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <h4 className="text-lg text-white" style={cormorant}>{item?.name}</h4>
                <p className="mt-1 text-[9px] uppercase tracking-widest text-[#D6B57A]" style={inter}>{item?.collection}</p>
              </div>
              <div className="flex items-center text-xs tracking-widest text-white/70" style={inter}>
                {formatPrice(parsePrice(item?.price as any) * (item?.quantity || 1))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-xs uppercase tracking-widest text-white/60" style={inter}>
            <span>Subtotal</span>
            <span className="text-white">{formatPrice(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-xs uppercase tracking-widest text-[#D6B57A]" style={inter}>
              <span>Privilege Savings</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs uppercase tracking-widest text-white/60" style={inter}>
            <span>Shipping</span>
            <span className="text-white">Complimentary</span>
          </div>
          <div className="flex justify-between text-xs uppercase tracking-widest text-white/60" style={inter}>
            <span>Taxes</span>
            <span className="text-white/40">Included</span>
          </div>
        </div>

        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-[#D6B57A]/50 to-transparent" />

        <div className="flex justify-between items-end text-sm uppercase tracking-widest text-white" style={inter}>
          <span>Total</span>
          <span className="text-3xl text-[#D6B57A] font-light" style={cormorant}>{formatPrice(finalTotal)}</span>
        </div>
      </div>
    </div>
  )
})

const DeliveryCard = memo(() => {
  const estimatedArrival = useMemo(() => {
    const d1 = new Date(); d1.setDate(d1.getDate() + 2);
    const d2 = new Date(); d2.setDate(d2.getDate() + 3);
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${d1.toLocaleDateString('en-US', opts)} – ${d2.toLocaleDateString('en-US', opts)}`;
  }, [])

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-[#050505] p-6 flex gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#D6B57A]/30 bg-[#D6B57A]/5 text-[#D6B57A]">
        <Truck className="h-5 w-5" />
      </div>
      <div className="flex flex-col justify-center">
        <h4 className="text-sm text-white" style={cormorant}>Complimentary Insured Delivery</h4>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-[#D6B57A]" style={inter}>Estimated Arrival: {estimatedArrival}</p>
      </div>
    </div>
  )
})

const VeloriaPrivileges = memo(() => (
  <div className="mt-8">
    <h4 className="mb-4 text-[10px] uppercase tracking-[0.2em] text-white/50" style={inter}>Veloria Privileges</h4>
    <ul className="space-y-3">
      {['Lifetime Care', 'Complimentary Cleaning', 'Personal Concierge', 'Maison Certified', 'Delivery Protection'].map((privilege, i) => (
        <li key={i} className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/70" style={inter}>
          <CheckCircle className="h-3.5 w-3.5 text-[#D6B57A]" />
          {privilege}
        </li>
      ))}
    </ul>
  </div>
))



// ──────────────── MAIN PAGE COMPONENT ────────────────

export function PaymentPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchParams] = useSearchParams()
  const addressId = searchParams.get('addressId')

  const cartItems = useCartStore(state => state.items)
  const subtotal = useCartStore(state => state.cartTotal)

  const { discountType, discountValue } = useCouponStore()
  const safeDiscountValue = Number(discountValue) || 0;
  const discountAmount = discountType === 'percentage' ? subtotal * (safeDiscountValue / 100) : safeDiscountValue;
  const finalTotal = Math.max(0, subtotal - discountAmount) || 0;
  const { user } = useAuthStore()
  const { addresses, fetchData: fetchBuyerData } = useBuyerStore()


  const selectedAddress = useMemo(() => {
    if (addressId && addressId !== 'new') {
      return (Array.isArray(addresses) ? addresses : [])?.find((a: any) => (a?.id === addressId || a?._id === addressId)) || (Array.isArray(addresses) ? addresses[0] : undefined);
    }
    return Array.isArray(addresses) ? addresses[0] : undefined;
  }, [addresses, addressId]);

const handleRazorpayPayment = async () => {
  if (!navigator.onLine) {
    toast.error("No internet connection.");
    return;
}
  // 1. Prevent duplicate clicks and multiple Razorpay popups
  if (isProcessing) {
    console.warn("[Checkout] Payment processing already in progress. Blocking duplicate invocation.");
    toast.error("Payment is already processing. Please wait.");
    return;
  }

  setIsProcessing(true);
  console.log("[Checkout] Initiating Razorpay payment flow...");

  // Setup timeout tracking variables for safe exit handling
  let isVerifyTimedOut = false;
let verifyTimeoutId: ReturnType<typeof setTimeout> | null = null;
  const abortController = new AbortController();

  try {
    // 2. Fetch authenticated JWT from Zustand store (Rule 4)
    const token = useAuthStore.getState().token;
   // ✅ Ab id aur _id dono chalenge
    const currentAddressId = selectedAddress?.id || (selectedAddress as any)?._id;
    const logout = useAuthStore.getState().logout; // Assuming logout function exists on store

    // 3. Validation Guards (Rule 3)
    if (!token) {
      console.warn("[Checkout] Validation Failed: User not logged in (Missing JWT).");
      toast.error("Please log in to complete your purchase.");
      navigate("/login");
      setIsProcessing(false);
      return;
    }

    const addressLine1 =
        selectedAddress?.addressLine1 ||
        selectedAddress?.addressLine1
      if (
        !selectedAddress ||
        !currentAddressId ||
        !selectedAddress?.city ||
        !addressLine1

      ) {
        toast.error("Please select a valid delivery address.");
        setIsProcessing(false);
        return;
      }

    if (!cartItems || cartItems.length === 0) {
      console.warn("[Checkout] Validation Failed: Cart is empty.");
      toast.error("Your cart is empty. Please add items to your cart.");
      setIsProcessing(false);
      return;
    }

    if (!finalTotal || finalTotal <= 0) {
      console.warn("[Checkout] Validation Failed: Order total must be greater than 0.");
      toast.error("Invalid order total amount. Cannot proceed with payment.");
      setIsProcessing(false);
      return;
    }

    console.log("[Checkout] All client-side validations passed. Creating backend order...");

    // 4. Create Order API Call with Retry Configuration (Rule 5, 7, 8, 19)
  
const createController = new AbortController();

const createTimeout = setTimeout(() => {
  createController.abort();
}, 15000);

const orderResponse = await fetch(`${API_URL}/payment/create-order`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    amount: finalTotal,
    items: cartItems,
    addressId: currentAddressId,
  }),
  signal: createController.signal,
});

clearTimeout(createTimeout);

    // Handle distinct HTTP error statuses for create-order (Rule 7)
    if (!orderResponse.ok) {
      const status = orderResponse.status;
      console.error(`[Checkout] Create Order failed with HTTP Status: ${status}`);
      
      if (status === 401 || status === 403) {
        toast.error("Session expired. Please log in again to continue.");
        if (typeof logout === "function") logout();
        navigate("/login");
        setIsProcessing(false);
        return;
      }
      
      let errorData;
      try { errorData = await orderResponse.json(); } catch { errorData = {}; }
      const errMsg = errorData.message || "Failed to initialize payment order.";

      if (status === 400) {
        toast.error(`Invalid Order Request: ${errMsg}`);
      } else if (status === 500) {
        toast.error(`Server Error: ${errMsg}. Please try again later.`);
      } else {
        toast.error(`Order Creation Failed (${status}): ${errMsg}`);
      }
      
      setIsProcessing(false);
      return;
    }

    const order = await orderResponse.json();
    console.log("[Checkout] Backend order generated successfully:", order);

    // 5. Build Comprehensive Order Payload for Verification Mapping
    const orderPayload = {
      addressId: currentAddressId,
      items: cartItems,
      amount: finalTotal,
      address: selectedAddress
    };

    // 6. Formulate Razorpay SDK Configuration (Rule 20, 21)
    const options: any = {
      key: RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "Veloria",
      description: "Jewellery Purchase",
      order_id: order.id,
      notes: {
        client_platform: "React-TypeScript Web",
        environment: "production",
        checkout_session_id: Date.now().toString()
      },
      handler: async function (response: any) {
        console.log("[Checkout] Razorpay modal verification event caught:", response);
        
        // 7. Verification API Timeout Mechanics (Rule 8, 9, 33)
        verifyTimeoutId = setTimeout(() => {
          isVerifyTimedOut = true;
          abortController.abort();
          console.error("[Checkout] Verification API request timed out locally.");
        }, 15000); // Strict 15 second validation boundary

        try {
          const freshToken = useAuthStore.getState().token;
          console.log("[Checkout] Dispatching authorization signatures to verification engine...");
          
          const verifyRes = await fetch(`${API_URL}/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${freshToken}`
            },
            signal: abortController.signal,
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderPayload
            })
          });

          if (verifyTimeoutId) clearTimeout(verifyTimeoutId);

          // Handle distinct HTTP error statuses for verify (Rule 6, 7, 32)
          if (!verifyRes.ok) {
            const vStatus = verifyRes.status;
            console.error(`[Checkout] Verification server responded with status: ${vStatus}`);
            
            if (vStatus === 401 || vStatus === 403) {
              toast.error("Your authorization session expired. Please re-authenticate.");
              if (typeof logout === "function") logout();
              navigate("/login");
              setIsProcessing(false);
              return;
            }

            let vErrorData;
            try { vErrorData = await verifyRes.json(); } catch { vErrorData = {}; }
            const vErrMsg = vErrorData.message || "Transaction confirmation failed.";

            if (vStatus === 400) {
              toast.error(`Verification Failure: ${vErrMsg}`);
            } else if (vStatus === 500) {
              toast.error(`Internal Server Error during verification: ${vErrMsg}`);
            } else {
              toast.error(`Verification Failed (${vStatus}): ${vErrMsg}`);
            }
            
            setIsProcessing(false);
            return;
          }

          const data = await verifyRes.json();
          console.log("[Checkout] Verification parsing terminated successfully:", data);

          // 8. Final Success Synchronization Execution Block (Rules 14, 15, 16, 17, 18, 31)
          if (data.success && data.order) {
            toast.success("Payment authorized and verified successfully!");
            
            console.log("[Checkout] Executing state synchronization: Clearing Cart.");
            useCartStore.setState({
              items: [],
              cart: [],
              cartCount: 0,
              cartTotal: 0
            });

            console.log("[Checkout] Executing state synchronization: Clearing active Coupons.");
            useCouponStore.setState({
              couponCode: "",
              discountValue: 0,
              discountType: "fixed"
            });

            setIsProcessing(false);
            navigate(`/order-success?id=${data.order.orderId}`);
          } else {
            const failMsg = data.message || "Cryptographic verification check failed.";
            console.error("[Checkout] Signature verification failed payload mismatch:", failMsg);
            toast.error(`Payment Verification Failed: ${failMsg}`);
            setIsProcessing(false);
          }

        } catch (verifyError: any) {
          if (verifyTimeoutId) clearTimeout(verifyTimeoutId);
          console.error("[Checkout] Critical exception hit inside transaction verify segment:", verifyError);
          
          if (verifyError.name === "AbortError" || isVerifyTimedOut) {
            toast.error("Network timeout. Please try again.");
          } else {
            toast.error(`Verification Error: ${verifyError.message || "An unhandled connection error disrupted verification. Check your order history before retrying."}`);
          }
          setIsProcessing(false);
        }
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: selectedAddress?.phone || ""
      },
      theme: {
        color: "#000000"
      },
      modal: {
        ondismiss: function () {
          // 9. Handle Modal Cancellation (Rule 11, 12, 13, 29)
          console.warn("[Checkout] User voluntarily terminated the Razorpay processing overlay modal.");
          toast.error("Payment cancelled");
          setIsProcessing(false);
        }
      }
    };

    if (!RAZORPAY_KEY) {
      console.error("[Checkout] VITE_RAZORPAY_KEY_ID is missing from the frontend environment. Add it to frontend/.env and restart `npm run dev` (Vite only reads .env at startup).");
      toast.error("Payment configuration error: Razorpay key is missing. Contact support.");
      setIsProcessing(false);
      return;
    }

    // @ts-ignore
    if (!(window as any).Razorpay) {
      toast.error("Unable to load Razorpay.");
      setIsProcessing(false);
      return;
    }
    
    // ✅ 'window' ki jagah '(window as any)' lagana zaroori hai Vercel ke liye
    const razorpay = new (window as any).Razorpay(options);

    // 10. Core Setup Event Listeners mapping payment runtime errors (Rule 10, 30)
    razorpay.on("payment.failed", function (response: any) {
      console.error("[Checkout] Razorpay native core pipeline payment failure reported:", response.error);
      toast.error(
      response.error?.description ||
      response.error?.reason ||
      response.error?.code ||
      "Payment Failed"
      )
      setIsProcessing(false);
    });

    console.log("[Checkout] Handing over execution thread control to Razorpay overlay UI module.");
    razorpay.open();

  } catch (globalExecutionError: any) {
    // 11. Catch-all fallback guard to completely prevent lockups (Rule 13, 28)
    console.error("[Checkout] Root-level context processing Exception:", globalExecutionError);
    toast.error(globalExecutionError.message || "An unexpected checkout initialization failure occurred. Please try again.");
    setIsProcessing(false);
  }
};

  useEffect(() => {
    window.scrollTo(0, 0)
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (user?.id) fetchBuyerData(user.id)
  }, [user?.id, fetchBuyerData])


  return (
    <div className="relative min-h-screen bg-[#030303] text-zinc-100 selection:bg-[#D6B57A]/30 selection:text-white font-sans pb-32 lg:pb-0">
      <PaymentNavbar />

      <main className="mx-auto w-full max-w-[1200px] px-6 py-12 lg:py-16">
        {loading ? (
          <SkeletonLoader />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-[65fr_35fr] gap-16"
          >
            {/* LEFT: Payment Experience */}
            <div className="flex flex-col">
              <ProgressTracker />

              <div className="mb-10">
                <h1 className="text-4xl text-white md:text-5xl font-light" style={cormorant}>Payment Details</h1>
                <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-white/50" style={inter}>
                  All transactions are secure and encrypted.
                </p>
              </div>

              {/* Delivery Verification & Payment Methods */}
              <DeliveryVerification address={selectedAddress} />
              <AvailablePaymentMethods />

              <TrustBadges />

              {/* Desktop Complete Button */}
              <div className="mt-16 hidden lg:block">
                <button 
                  onClick={handleRazorpayPayment}
                  disabled={isProcessing}
                  className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-white py-6 text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(214,181,122,0.5)] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {!isProcessing && (
                    <motion.div 
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#D6B57A]/40 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    />
                  )}
                  <span className="relative z-10 text-[11px] uppercase tracking-[0.25em] font-medium flex items-center gap-3" style={inter}>
                    {isProcessing ? 'Processing Securely...' : 'Proceed To Secure Payment'} 
                    {!isProcessing && <ArrowRight className="h-4 w-4" />}
                  </span>
                </button>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="flex flex-col">
              <OrderSummary subtotal={subtotal} finalTotal={finalTotal} items={cartItems} discountType={discountType} discountValue={discountValue} />
              <DeliveryCard />
              <VeloriaPrivileges />
            </div>
            
          </motion.div>
        )}
      </main>

      {/* MOBILE STICKY COMPLETE BAR */}
      {!loading && (
        <div className="fixed bottom-0 left-0 z-[150] w-full border-t border-white/10 bg-[#050505]/90 px-6 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/60" style={inter}>Total</span>
            <span className="text-xl text-[#D6B57A]" style={cormorant}>{formatPrice(finalTotal)}</span>
          </div>
          <button 
            onClick={handleRazorpayPayment}
            disabled={isProcessing}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-white py-5 text-black transition-transform active:scale-[0.98] disabled:opacity-70"
          >
            {!isProcessing && (
              <motion.div 
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#D6B57A]/40 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />
            )}
            <span className="relative z-10 text-[10px] uppercase tracking-[0.2em] font-medium" style={inter}>
              {isProcessing ? 'Processing...' : 'Proceed To Secure Payment'}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}