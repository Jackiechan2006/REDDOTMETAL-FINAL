"use client"

import { MessageCircle, Phone } from "lucide-react"
import { motion } from "framer-motion"

const WHATSAPP_NUMBER = "6588673343"
const PHONE_NUMBER = "+6588673343"

export default function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition-colors hover:bg-green-400"
        aria-label="WhatsApp us"
      >
        <MessageCircle className="h-7 w-7" />
      </motion.a>
      <motion.a
        href={`tel:${PHONE_NUMBER}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/30 transition-colors hover:bg-red-500"
        aria-label="Call us"
      >
        <Phone className="h-7 w-7" />
      </motion.a>
    </div>
  )
}
