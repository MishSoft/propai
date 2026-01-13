"use client"
import Link from 'next/link'

const links = [
  {
    id: 1,
    name: "Privacy Policy",
    href: "/policy"
  },

  {
    id: 2,
    name: "Terms of Service",
    href: "/service"
  },

  {
    id: 3,
    name: "Contact Support",
    href: "/support"
  },
]

export default function Footer() {
  return (
    <footer className='flex flex-col items-center gap-2 w-full mt-20'>
      <div className='flex items-center gap-5 text-gray-500 text-sm'>
        {
          links.map((link) => {
            return (
              <Link key={link.id} href={link.href}>
                {link.name}
              </Link>
            )
          })
        }
      </div>
      <h2 className='text-gray-500 text-xs'>
        2026 estate technologies inc
      </h2>
    </footer>
  )
}
