'use client'

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { CloudUpload, Loader2, PlusCircle, X } from 'lucide-react'
import { createListing, getProductById, updateListing } from '@/lib/marketplace'
import type { Category } from '@/types'

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'] as const

type FormState = {
  title: string
  description: string
  price: string
  categoryId: string
  condition: string
  location: string
  contactPreference: string
  additionalNotes: string
}

type Errors = Partial<Record<keyof FormState | 'images', string>>

const initialState: FormState = {
  title: '',
  description: '',
  price: '',
  categoryId: '',
  condition: 'Good',
  location: '',
  contactPreference: '',
  additionalNotes: '',
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export function SellItemForm({ productId }: { productId?: string }) {
  const isEditMode = !!productId
  const router = useRouter()
  const { getToken } = useAuth()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const [form, setForm] = useState<FormState>(initialState)
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [errors, setErrors] = useState<Errors>({})
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!productId) return
    let mounted = true
    void (async () => {
      try {
        const token = await getToken()
        const product = await getProductById(productId, token ?? undefined)
        if (mounted && product) {
          setForm({
            title: product.title,
            description: product.description,
            price: product.price.toString(),
            categoryId: product.category.id,
            condition: product.condition,
            location: '',
            contactPreference: '',
            additionalNotes: '',
          })
          setExistingImages(product.images || [])
        }
      } catch (e) {
        console.error('Failed to load product', e)
      }
    })()
    return () => {
      mounted = false
    }
  }, [productId, getToken])

  useEffect(() => {
    let mounted = true
    void (async () => {
      try {
        const response = await fetch(`${API_URL}/categories`)
        const payload = await response.json().catch(() => ({}))
        const data = Array.isArray(payload.data) ? payload.data : []
        if (mounted) setCategories(data)
      } finally {
        if (mounted) setLoadingCategories(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])

  useEffect(() => {
    const nextPreviews = images.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setPreviews(nextPreviews)

    return () => {
      nextPreviews.forEach((item) => URL.revokeObjectURL(item.url))
    }
  }, [images])

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const addFiles = (files: FileList | File[]) => {
    const next = Array.from(files).filter((file) => file.type.startsWith('image/'))
    if (next.length === 0) return
    setImages((current) => [...current, ...next].slice(0, 5))
    setErrors((current) => ({ ...current, images: undefined }))
  }

  const validate = () => {
    const nextErrors: Errors = {}

    if (!form.title.trim()) nextErrors.title = 'Product title is required.'
    if (!form.description.trim()) nextErrors.description = 'Description is required.'
    if (!form.price.trim()) nextErrors.price = 'Price is required.'
    else if (Number.isNaN(Number(form.price)) || Number(form.price) <= 0) nextErrors.price = 'Enter a valid price.'
    if (!form.categoryId) nextErrors.categoryId = 'Choose a category.'
    if (!form.condition) nextErrors.condition = 'Choose a condition.'
    if (!form.location.trim()) nextErrors.location = 'Location is required.'
    if (images.length === 0 && existingImages.length === 0) nextErrors.images = 'Add at least one image.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitMessage(null)
    if (!validate()) return

    setSubmitting(true)
    setProgress(0)

    try {
      const token = await getToken()
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: form.price.trim(),
        condition: form.condition,
        categoryId: form.categoryId,
        imageFiles: images,
      }
      
      const product = isEditMode
        ? await updateListing(productId, { ...payload, existingImages }, token ?? undefined, setProgress)
        : await createListing(payload, token ?? undefined, setProgress)

      setSubmitMessage(isEditMode ? 'Listing updated successfully.' : 'Listing published successfully.')
      router.replace(`/listings/${product.id}`)
      router.refresh()
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : 'Could not create listing.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-950">{isEditMode ? 'Edit listing' : 'Sell an item'}</h2>
            <p className="mt-1 text-sm text-gray-500">{isEditMode ? 'Update your listing details.' : 'Create a shared listing that appears everywhere instantly.'}</p>
          </div>

        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragActive(false)
            if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
          }}
          className={`rounded-[1.5rem] border-2 border-dashed p-5 transition ${dragActive ? 'border-black bg-gray-50' : 'border-gray-200 bg-white'}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-[1.25rem] px-4 py-10 text-center"
          >
            <CloudUpload className="h-8 w-8 text-gray-900" />
            <span className="text-sm font-semibold text-gray-950">Drag and drop images here</span>
            <span className="text-sm text-gray-500">or click to browse. Up to 5 photos.</span>
          </button>
          {errors.images ? <p className="mt-3 text-sm text-red-600">{errors.images}</p> : null}
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
            {existingImages.map((url, index) => (
              <div key={url} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                <img src={url} alt={`Existing ${index}`} className="h-36 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setExistingImages((current) => current.filter((_, i) => i !== index))}
                  className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-gray-700 shadow-sm opacity-100 transition group-hover:bg-black group-hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {previews.map((item, index) => (
              <div key={`${item.file.name}-${index}`} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                <img src={item.url} alt={item.file.name} className="h-36 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                  className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-gray-700 shadow-sm opacity-100 transition group-hover:bg-black group-hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {submitting ? (
          <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
              <span>Uploading listing</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full rounded-full bg-black transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}
      </section>

      <aside className="space-y-6 rounded-[2rem] border border-gray-200 bg-white p-5 shadow-sm">
        <Field label="Product title" error={errors.title}>
          <input className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black" value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="MacBook Air M1" />
        </Field>
        <Field label="Description" error={errors.description}>
          <textarea className="min-h-28 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black" value={form.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Condition, usage, accessories, anything the buyer should know." />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Price" error={errors.price}>
            <input type="number" min="1" className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black" value={form.price} onChange={(e) => updateField('price', e.target.value)} placeholder="0" />
          </Field>
          <Field label="Location" error={errors.location}>
            <input className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black" value={form.location} onChange={(e) => updateField('location', e.target.value)} placeholder="Campus, city" />
          </Field>
        </div>

        <Field label="Category" error={errors.categoryId}>
          <select className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black" value={form.categoryId} onChange={(e) => updateField('categoryId', e.target.value)}>
            <option value="">{loadingCategories ? 'Loading categories...' : 'Select category'}</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </Field>

        <Field label="Condition" error={errors.condition}>
          <div className="grid grid-cols-2 gap-2">
            {CONDITIONS.map((condition) => (
              <button key={condition} type="button" onClick={() => updateField('condition', condition)} className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${form.condition === condition ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                {condition}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Contact preference">
          <input className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black" value={form.contactPreference} onChange={(e) => updateField('contactPreference', e.target.value)} placeholder="Chat, call, WhatsApp" />
        </Field>

        <Field label="Additional notes">
          <textarea className="min-h-24 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black" value={form.additionalNotes} onChange={(e) => updateField('additionalNotes', e.target.value)} placeholder="Optional details for buyers." />
        </Field>

        {submitMessage ? <p className={`text-sm ${submitMessage.includes('successfully') ? 'text-emerald-700' : 'text-red-600'}`}>{submitMessage}</p> : null}

        <button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4" />}
          {isEditMode ? 'Save changes' : 'Publish listing'}
        </button>

        <p className="text-xs leading-5 text-gray-500">
          This uses the shared `Product` schema, so the listing will appear across web, mobile, dashboard, and profile views without any separate web-only storage.
        </p>
      </aside>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {error ? <span className="text-xs font-medium text-red-600">{error}</span> : null}
      </div>
      {children}
    </label>
  )
}
