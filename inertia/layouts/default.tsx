import { Toaster } from 'sonner'
import { type ReactElement } from 'react'
import { type Data } from '@generated/data'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  return (
    <>
      <Toaster position="top-center" richColors />
      {children}
    </>
  )
}
