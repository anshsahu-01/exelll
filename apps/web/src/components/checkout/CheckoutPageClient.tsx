'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { createOrder, getCart, getProductById, removeCartItem } from '@/lib/marketplace'
import { useUser } from '@clerk/nextjs'
import { Upload, Loader2, CreditCard, Wallet, CheckCircle2, X, FileImage } from 'lucide-react'
import { formatINR } from '@/lib/format'

type CheckoutProduct = Awaited<ReturnType<typeof getProductById>>

type CheckoutSource =
  | { kind: 'single'; product: CheckoutProduct }
  | { kind: 'cart'; items: Awaited<ReturnType<typeof getCart>>['items'] }

type PaymentMethod = 'COD' | 'UPI'

type DeliveryForm = {
  fullName: string
  mobileNumber: string
  address: string
  city: string
  state: string
  pincode: string
  utrNumber: string
  screenshotDataUrl: string
}

const MAX_SCREENSHOT_BYTES = 4 * 1024 * 1024
const MAX_IMAGE_WIDTH = 1200

const EMPTY_FORM: DeliveryForm = {
  fullName: '',
  mobileNumber: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  utrNumber: '',
  screenshotDataUrl: '',
}

export function CheckoutPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { getToken } = useAuth()
  const { user } = useUser()
  const [source, setSource] = useState<CheckoutSource | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD')
  const [form, setForm] = useState<DeliveryForm>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [uploadingProof, setUploadingProof] = useState(false)
  const [screenshotName, setScreenshotName] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const productId = searchParams.get('productId')
        const cartMode = searchParams.get('mode') === 'cart'
        if (cartMode) {
          const token = await getToken()
          const cart = await getCart(token ?? undefined)
          if (active) setSource({ kind: 'cart', items: cart.items })
          return
        }
        if (!productId) {
          throw new Error('No product selected for checkout.')
        }
        const product = await getProductById(productId)
        if (active) setSource({ kind: 'single', product })
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Could not load checkout data.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [getToken, searchParams])

  useEffect(() => {
    if (!user) return
    setForm((current) => ({
      ...current,
      fullName: current.fullName || user.fullName || user.firstName || '',
    }))
  }, [user])

  const items = useMemo(() => {
    if (!source) return []
    return source.kind === 'single'
      ? [
          {
            productId: source.product.id,
            title: source.product.title,
            image: source.product.images?.[0] ?? '',
            price: source.product.price,
            sellerName: source.product.seller.name,
            quantity: 1,
          },
        ]
      : source.items.map((item) => ({
          productId: item.productId,
          title: item.product.title,
          image: item.product.images?.[0] ?? '',
          price: item.product.price,
          sellerName: item.product.seller.name,
          quantity: item.quantity,
        }))
  }, [source])

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )

  const finalAddress = useMemo(() => {
    const parts = [form.address, form.city, form.state, form.pincode].filter(Boolean)
    return parts.join(', ')
  }, [form.address, form.city, form.state, form.pincode])

  const validate = () => {
    if (!form.fullName.trim() || !form.mobileNumber.trim() || !form.address.trim() || !form.city.trim() || !form.state.trim() || !form.pincode.trim()) {
      setError('Please complete all delivery fields.')
      return false
    }
    if (!/^\d{10,15}₹/.test(form.mobileNumber.trim())) {
      setError('Mobile number must be 10 to 15 digits.')
      return false
    }
    if (paymentMethod === 'UPI' && (!form.utrNumber.trim() || !form.screenshotDataUrl)) {
      setError('UTR and payment proof are required for online payment.')
      return false
    }
    setError(null)
    return true
  }

  const onUploadScreenshot = async (file: File | null) => {
    if (!file) return
    if (file.size > MAX_SCREENSHOT_BYTES) {
      setUploadError('Image too large. Please upload a smaller screenshot.')
      return
    }
    setUploadError(null)
    setUploadingProof(true)
    try {
      const dataUrl = await compressImageFile(file)
      if (dataUrl.length > 1800000) {
        setUploadError('Image too large after compression. Please upload a smaller screenshot.')
        setForm((current) => ({ ...current, screenshotDataUrl: '' }))
        setScreenshotName(null)
        return
      }
      setForm((current) => ({ ...current, screenshotDataUrl: dataUrl }))
      setScreenshotName(file.name)
    } catch {
      setUploadError('Could not upload screenshot. Please try again.')
    } finally {
      setUploadingProof(false)
    }
  }

  const placeOrder = async () => {
    if (!validate() || items.length === 0) return
    setSubmitting(true)
    try {
      const token = await getToken()
      const deliveryDetails = [form.address.trim(), form.city.trim(), form.state.trim(), form.pincode.trim()].join(', ')
      const createSingle = async (productId: string, amountHint?: number) =>
        createOrder(
          {
            productId,
            paymentMethod,
            mobileNumber: form.mobileNumber.trim(),
            locationDetails: deliveryDetails,
            utrNumber: paymentMethod === 'UPI' ? form.utrNumber.trim() : undefined,
            paymentScreenshot: paymentMethod === 'UPI' ? form.screenshotDataUrl : undefined,
            paymentStatus: paymentMethod === 'UPI' ? 'verification_pending' : 'payment_pending',
          },
          token ?? undefined
        )

      for (const item of items) {
        await createSingle(item.productId, item.price)
        if (source?.kind === 'cart') {
          await removeCartItem(item.productId, token ?? undefined)
        }
      }

      window.dispatchEvent(new Event('cart-updated'))
      router.push('/profile/orders')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place order.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="h-24 animate-pulse rounded-[2rem] bg-gray-200" />
          <div className="h-72 animate-pulse rounded-[2rem] bg-gray-200" />
          <div className="h-96 animate-pulse rounded-[2rem] bg-gray-200" />
          <div className="h-[28rem] animate-pulse rounded-[2rem] bg-gray-200" />
        </section>
        <aside className="h-fit space-y-6 rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
          <div className="h-6 w-28 animate-pulse rounded-2xl bg-gray-200" />
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded-2xl bg-gray-200" />
            <div className="h-4 w-5/6 animate-pulse rounded-2xl bg-gray-200" />
            <div className="h-4 w-4/5 animate-pulse rounded-2xl bg-gray-200" />
            <div className="h-px w-full bg-gray-200" />
            <div className="h-5 w-3/5 animate-pulse rounded-2xl bg-gray-200" />
          </div>
          <div className="h-12 w-full animate-pulse rounded-2xl bg-gray-200" />
        </aside>
      </div>
    )
  }

  if (error || items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-gray-200 bg-white p-6 text-sm text-gray-500">
        {error || 'No product selected for checkout.'}
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-6">
        <Panel title="Order details" subtitle={`₹{items.length} item₹{items.length > 1 ? 's' : ''} selected for checkout.`} />

        <Panel title="Selected products">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 rounded-2xl border border-gray-200 p-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gray-100">
                  {item.image ? <Image src={item.image} alt={item.title} fill className="object-cover" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-gray-950">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">Seller: {item.sellerName}</p>
                  <p className="mt-1 text-sm text-gray-950">Qty: {item.quantity}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-950">{formatINR(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Delivery details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input
                className={sharedInputClass}
                value={form.fullName}
                onChange={(e) => setForm((c) => ({ ...c, fullName: e.target.value }))}
                placeholder="Full name"
              />
            </Field>
            <Field label="Mobile number">
              <input
                className={sharedInputClass}
                value={form.mobileNumber}
                onChange={(e) => setForm((c) => ({ ...c, mobileNumber: e.target.value }))}
                placeholder="10-digit mobile number"
              />
            </Field>
            <Field label="Pickup / delivery address" className="sm:col-span-2">
              <textarea
                className={`₹{sharedInputClass} min-h-28 resize-none py-4`}
                value={form.address}
                onChange={(e) => setForm((c) => ({ ...c, address: e.target.value }))}
                placeholder="Street / building / landmark"
              />
            </Field>
            <Field label="City">
              <input
                className={sharedInputClass}
                value={form.city}
                onChange={(e) => setForm((c) => ({ ...c, city: e.target.value }))}
                placeholder="City"
              />
            </Field>
            <Field label="State">
              <input
                className={sharedInputClass}
                value={form.state}
                onChange={(e) => setForm((c) => ({ ...c, state: e.target.value }))}
                placeholder="State"
              />
            </Field>
            <Field label="Pincode" className="sm:col-span-2">
              <input
                className={sharedInputClass}
                value={form.pincode}
                onChange={(e) => setForm((c) => ({ ...c, pincode: e.target.value }))}
                placeholder="Pincode"
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Payment method">
          <div className="grid gap-3 sm:grid-cols-2">
            <PaymentCard icon={<Wallet className="h-5 w-5" />} active={paymentMethod === 'COD'} label="Cash on Delivery" onClick={() => setPaymentMethod('COD')} />
            <PaymentCard icon={<CreditCard className="h-5 w-5" />} active={paymentMethod === 'UPI'} label="Online Payment" onClick={() => setPaymentMethod('UPI')} />
          </div>

          {paymentMethod === 'UPI' ? (
            <div className="mt-5 rounded-[1.5rem] border border-gray-200 bg-gray-50 p-4">
              <div className="grid gap-5 lg:grid-cols-[auto_1fr] lg:items-start">
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <Image src="/upi-qr.jpeg" alt="UPI QR code" width={240} height={240} className="h-56 w-56 rounded-xl object-contain" />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Scan to pay</p>
                    <p className="mt-1 text-lg font-semibold text-gray-950">9109185454-2@axl</p>
                  </div>
                  <Field label="UTR / transaction reference number">
                    <input
                      className={sharedInputClass}
                      value={form.utrNumber}
                      onChange={(e) => setForm((c) => ({ ...c, utrNumber: e.target.value }))}
                      placeholder="Enter UTR"
                    />
                  </Field>
                  <Field label="Payment screenshot">
                    <div className="rounded-[1.25rem] border border-gray-200 bg-white p-4">
                      <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center text-sm text-gray-500 transition hover:border-gray-400 hover:bg-white">
                        {uploadingProof ? (
                          <Loader2 className="h-6 w-6 animate-spin text-gray-900" />
                        ) : form.screenshotDataUrl ? (
                          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        ) : (
                          <Upload className="h-6 w-6 text-gray-900" />
                        )}
                        <span className="mt-2 font-medium text-gray-950">
                          {uploadingProof ? 'Uploading...' : form.screenshotDataUrl ? 'Screenshot uploaded' : 'Tap to upload screenshot'}
                        </span>
                        <span className="mt-1 text-xs text-gray-500">
                          {screenshotName || 'PNG, JPG, or JPEG'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => onUploadScreenshot(e.target.files?.[0] ?? null)}
                        />
                      </label>
                      {form.screenshotDataUrl ? (
                        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3">
                          <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-gray-100">
                            <Image src={form.screenshotDataUrl} alt="Payment screenshot preview" fill className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-950">{screenshotName ?? 'Payment screenshot'}</p>
                            <p className="text-xs text-emerald-600">Upload complete</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setForm((current) => ({ ...current, screenshotDataUrl: '' }))
                              setScreenshotName(null)
                            }}
                            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-950"
                            aria-label="Remove screenshot"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : null}
                    </div>
                    {uploadError ? <p className="mt-2 text-sm text-red-600">{uploadError}</p> : null}
                  </Field>
                </div>
              </div>
            </div>
          ) : null}
        </Panel>
      </section>

      <aside className="h-fit space-y-6 rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-950">Summary</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <Row label="Subtotal" value={formatINR(subtotal)} />
            <Row label="Delivery" value={formatINR(0)} />
            <div className="h-px bg-gray-200" />
            <Row label="Final total" value={formatINR(subtotal)} strong />
          </div>
        </div>

        <button
          type="button"
          onClick={() => void placeOrder()}
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Place Order
        </button>

        <Link href={source?.kind === 'cart' ? '/cart' : `/listings/₹{items[0]?.productId}`} className="block text-center text-sm font-semibold text-gray-500 hover:text-gray-950">
          Back
        </Link>
      </aside>
    </div>
  )
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read payment screenshot.'))
    reader.readAsDataURL(file)
  })
}

async function compressImageFile(file: File) {
  const originalDataUrl = await readFileAsDataUrl(file)
  const image = await loadImage(originalDataUrl)
  const scale = Math.min(1, MAX_IMAGE_WIDTH / Math.max(image.width, image.height))
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not prepare screenshot for upload.')
  ctx.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', 0.8)
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load screenshot image.'))
    img.src = src
  })
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-950">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm text-gray-500">{subtitle}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  )
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block space-y-2 ₹{className ?? ''}`}>
      <span className="text-sm font-medium text-gray-900">{label}</span>
      {children}
    </label>
  )
}

// Shared premium input styling for the checkout form
const sharedInputClass =
  'checkout-input w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/5'

function PaymentCard({
  icon,
  active,
  label,
  onClick,
}: {
  icon: React.ReactNode
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition ₹{active ? 'border-black bg-gray-50' : 'border-gray-200 hover:bg-gray-50'}`}
    >
      <span className="flex items-center gap-3 text-sm font-medium text-gray-950">
        {icon}
        {label}
      </span>
      <span className={`h-4 w-4 rounded-full border ₹{active ? 'border-black bg-black' : 'border-gray-300 bg-white'}`} />
    </button>
  )
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between ₹{strong ? 'text-base font-semibold text-gray-950' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
