import { Resend } from "resend"

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn("RESEND_API_KEY not set — email will not be sent")
    return null
  }
  return new Resend(key)
}

const fromEmail = process.env.FROM_EMAIL ?? "noreply@reddotmetals.com"
const adminEmail = process.env.ADMIN_EMAIL ?? "sgreddotmetal@gmail.com"

interface ContactFormData {
  name: string
  company?: string
  phone: string
  metalType: string
  message: string
  email?: string
}

export async function submitContactForm(data: ContactFormData) {
  const resend = getResend()
  if (!resend) return

  await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `New Contact Request from ${data.name}`,
    html: `<h2>New Contact Request</h2>
      <p><strong>Name:</strong> ${sanitize(data.name)}</p>
      <p><strong>Company:</strong> ${sanitize(data.company ?? "—")}</p>
      <p><strong>Phone:</strong> ${sanitize(data.phone)}</p>
      <p><strong>Metal Type:</strong> ${sanitize(data.metalType)}</p>
      <p><strong>Message:</strong> ${sanitize(data.message)}</p>`,
  })

  if (data.email) {
    await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "We received your enquiry — Red Dot Metals",
      html: `<h2>Thank you, ${sanitize(data.name)}!</h2>
        <p>We have received your enquiry and will get back to you within 1 business day.</p>
        <p>— Red Dot Metals Team</p>`,
    })
  }
}

interface QuoteFormData {
  companyName: string
  contactPerson: string
  email: string
  phone: string
  metalTypes: string[]
  estimatedWeight: string
  pickupAddress: string
  preferredDate: string
  notes?: string
}

export async function submitQuoteForm(data: QuoteFormData) {
  const resend = getResend()
  if (!resend) return

  await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    subject: `New Quote Request — ${data.companyName}`,
    html: `<h2>New Quote Request</h2>
      <p><strong>Company:</strong> ${sanitize(data.companyName)}</p>
      <p><strong>Contact:</strong> ${sanitize(data.contactPerson)}</p>
      <p><strong>Email:</strong> ${sanitize(data.email)}</p>
      <p><strong>Phone:</strong> ${sanitize(data.phone)}</p>
      <p><strong>Metal Types:</strong> ${data.metalTypes.map(sanitize).join(", ")}</p>
      <p><strong>Weight:</strong> ${sanitize(data.estimatedWeight)} kg</p>
      <p><strong>Address:</strong> ${sanitize(data.pickupAddress)}</p>
      <p><strong>Date:</strong> ${sanitize(data.preferredDate)}</p>
      <p><strong>Notes:</strong> ${sanitize(data.notes ?? "—")}</p>`,
  })

  await resend.emails.send({
    from: fromEmail,
    to: data.email,
    subject: "Quote Request Received — Red Dot Metals",
    html: `<h2>Thank you, ${sanitize(data.contactPerson)}!</h2>
      <p>We have received your quote request for <strong>${data.metalTypes.map(sanitize).join(", ")}</strong>.</p>
      <p>Our team will review and contact you within 1 business day.</p>
      <p>— Red Dot Metals Team</p>`,
  })
}

function sanitize(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}
