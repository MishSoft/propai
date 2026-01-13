import Link from 'next/link'

interface GoToAuthProps {
  text: string
  link: string
  where: string
}

export default function GoToAuth({text, link, where}: GoToAuthProps) {
  return (
    <p className='my-5 text-gray-500'>
      {text} <Link className='text-blue-400 font-semibold' href={link}>{where}</Link>
    </p>
  )
}
