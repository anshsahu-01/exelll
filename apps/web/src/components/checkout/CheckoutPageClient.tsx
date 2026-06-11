'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Upload, Loader2, CreditCard, Wallet, CheckCircle2, X } from 'lucide-react'
import { createOrder, getCart, getProductById, removeCartItem } from '@/lib/marketplace'
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

  const isFormValid =
  !!form.fullName.trim() &&
  !!form.mobileNumber.trim() &&
  !!form.address.trim() &&
  !!form.city.trim() &&
  !!form.state.trim() &&
  !!form.pincode.trim() &&
  /^\d{10,15}$/.test(form.mobileNumber.trim()) &&
  (
    paymentMethod === 'COD' ||
    (
      !!form.utrNumber.trim() &&
      !!form.screenshotDataUrl
    )
  )

  const validate = () => {
    if (
      !form.fullName.trim() ||
      !form.mobileNumber.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      setError('Please complete all delivery fields.')
      return false
    }
    if (!/^\d{10,15}$/.test(form.mobileNumber.trim())) {
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

      for (const item of items) {
        await createOrder(
          {
            productId: item.productId,
            paymentMethod,
            mobileNumber: form.mobileNumber.trim(),
            locationDetails: deliveryDetails,
            utrNumber: paymentMethod === 'UPI' ? form.utrNumber.trim() : undefined,
            paymentScreenshot: paymentMethod === 'UPI' ? form.screenshotDataUrl : undefined,
            paymentStatus: paymentMethod === 'UPI' ? 'verification_pending' : 'payment_pending',
          },
          token ?? undefined
        )

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
        <aside className="h-fit space-y-6 rounded-[2rem] border border-border-default bg-surface p-5 shadow-sm">
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
      <div className="rounded-[2rem] border border-border-default bg-surface p-6 text-sm text-secondary">
        {error || 'No product selected for checkout.'}
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-6">
        <Panel
          title="Order details"
          subtitle={`${items.length} item${items.length > 1 ? 's' : ''} selected for checkout.`}
        />

        <Panel title="Selected products">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 rounded-2xl border border-border-default p-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-surface-hover">
                  {item.image ? <Image src={item.image} alt={item.title} fill className="object-cover" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-primary">{item.title}</h3>
                  <p className="mt-1 text-sm text-secondary">Seller: {item.sellerName}</p>
                  <p className="mt-1 text-sm text-primary">Qty: {item.quantity}</p>
                  <p className="mt-1 text-sm font-semibold text-primary">{formatINR(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Delivery details">
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
            Contact information is revealed only after a seller accepts an order. The phone number
            entered here is used for checkout and may be shown to the seller after acceptance.
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <input
                required
                className={sharedInputClass}
                value={form.fullName}
                onChange={(e) => setForm((c) => ({ ...c, fullName: e.target.value }))}
                placeholder="Full name"
              />
            </Field>
            <Field label="Mobile number">
              <input
                required
                inputMode="numeric"
                maxLength={15}
                className={sharedInputClass}
                value={form.mobileNumber}
                onChange={(e) => setForm((c) => ({ ...c, mobileNumber: e.target.value }))}
                placeholder="10-digit mobile number"
              />
            </Field>
            <Field label="College name">
              <input
                required
                className={sharedInputClass}
                value={(form as any).collegeName ?? ''}
                onChange={(e) => setForm((c) => ({ ...c, collegeName: e.target.value } as any))}
                placeholder="Enter your college name (e.g. RGPV Bhopal)"
              />
            </Field>
            <Field label="Pickup / delivery address" className="sm:col-span-2">
              <textarea
                required
                className={`${sharedInputClass} min-h-28 resize-none py-4`}
                value={form.address}
                onChange={(e) => setForm((c) => ({ ...c, address: e.target.value }))}
                placeholder="Street / building / landmark"
              />
            </Field>
            <Field label="City">
              <input
                required
                className={sharedInputClass}
                value={form.city}
                onChange={(e) => setForm((c) => ({ ...c, city: e.target.value }))}
                placeholder="City"
              />
            </Field>
            <Field label="State">
              <input
                required
                className={sharedInputClass}
                value={form.state}
                onChange={(e) => setForm((c) => ({ ...c, state: e.target.value }))}
                placeholder="State"
              />
            </Field>
            <Field label="Pincode" className="sm:col-span-2">
              <input
                required
                inputMode="numeric"
                maxLength={6}
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
            <PaymentCard
              icon={<Wallet className="h-5 w-5" />}
              active={paymentMethod === 'COD'}
              label="Cash on Delivery"
              onClick={() => setPaymentMethod('COD')}
            />
          </div>

          {paymentMethod === 'UPI' ? (
            <div className="mt-5 rounded-[1.5rem] border border-border-default bg-surface-hover p-4">
              <div className="grid gap-5 lg:grid-cols-[auto_1fr] lg:items-start">
                <div className="rounded-2xl bg-surface p-4 shadow-sm">
                  <Image src="/upi-qr.jpeg" alt="UPI QR code" width={240} height={240} className="h-56 w-56 rounded-xl object-contain" />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-secondary">Scan to pay</p>
                    <p className="mt-1 text-lg font-semibold text-primary">9109185454-2@axl</p>
                  </div>
                  <Field label="UTR / transaction reference number">
                    <input
                      required
                      className={sharedInputClass}
                      value={form.utrNumber}
                      onChange={(e) => setForm((c) => ({ ...c, utrNumber: e.target.value }))}
                      placeholder="Enter UTR"
                    />
                  </Field>
                  <Field label="Payment screenshot">
                    <div className="rounded-[1.25rem] border border-border-default bg-surface p-4">
                      <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border-default bg-surface-hover p-5 text-center text-sm text-secondary transition hover:border-gray-400 hover:bg-surface">
                        {uploadingProof ? (
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        ) : form.screenshotDataUrl ? (
                          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        ) : (
                          <Upload className="h-6 w-6 text-primary" />
                        )}
                        <span className="mt-2 font-medium text-primary">
                          {uploadingProof ? 'Uploading...' : form.screenshotDataUrl ? 'Screenshot uploaded' : 'Tap to upload screenshot'}
                        </span>
                        <span className="mt-1 text-xs text-secondary">{screenshotName || 'PNG, JPG, or JPEG'}</span>
                        <input
                          required
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => onUploadScreenshot(e.target.files?.[0] ?? null)}
                        />
                      </label>
                      {form.screenshotDataUrl ? (
                        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border-default bg-surface p-3">
                          <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-surface-hover">
                            <Image src={form.screenshotDataUrl} alt="Payment screenshot preview" fill className="object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-primary">{screenshotName ?? 'Payment screenshot'}</p>
                            <p className="text-xs text-emerald-600">Upload complete</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setForm((current) => ({ ...current, screenshotDataUrl: '' }))
                              setScreenshotName(null)
                            }}
                            className="rounded-full p-2 text-secondary transition hover:bg-surface-hover hover:text-primary"
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

      <aside className="h-fit space-y-6 rounded-[2rem] border border-border-default bg-surface p-5 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-primary">Summary</h2>
          <div className="mt-4 space-y-3 text-sm text-secondary">
            <Row label="Subtotal" value={formatINR(subtotal)} />
            <Row label="Delivery" value={formatINR(0)} />
            <div className="h-px bg-gray-200" />
            <Row label="Final total" value={formatINR(subtotal)} strong />
          </div>
        </div>

        <button
          type="button"
          onClick={() => void placeOrder()}
          disabled={submitting || !isFormValid}
          className="disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Place Order
        </button>

        <Link
          href={source?.kind === 'cart' ? '/cart' : `/listings/${items[0]?.productId}`}
          className="block text-center text-sm font-semibold text-secondary hover:text-primary"
        >
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
    <div className="rounded-[2rem] border border-border-default bg-surface p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-primary">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm text-secondary">{subtitle}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={`block space-y-2 ${className ?? ''}`}>
      <span className="text-sm font-medium text-primary">{label}</span>
      {children}
    </label>
  )
}

const sharedInputClass =
  'checkout-input w-full rounded-2xl border border-border-default bg-surface px-4 py-3.5 text-sm text-primary outline-none transition placeholder:text-secondary focus:border-primary focus:ring-2 focus:ring-primary/5'

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
      className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
        active ? 'border-black bg-surface-hover' : 'border-border-default hover:bg-surface-hover'
      }`}
    >
      <span className="flex items-center gap-3 text-sm font-medium text-primary">
        {icon}
        {label}
      </span>
      <span
        className={`h-4 w-4 rounded-full border ${
          active ? 'border-black bg-black' : 'border-border-default bg-surface'
        }`}
      />
    </button>
  )
}

function Row({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${strong ? 'text-base font-semibold text-primary' : ''}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}
