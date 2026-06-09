'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../store/auth'

export default function Root() {
  const router = useRouter()
  const { accessToken } = useAuthStore()
  useEffect(() => {
    router.replace(accessToken ? '/dashboard' : '/login')
  }, [accessToken, router])
  return null
}
