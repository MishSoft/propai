import React from 'react'

export default function Separator() {
  return (
    <div className="relative flex py-5 items-center">
          <div className="grow border-t border-gray-300"></div>
          <span className="shrink mx-4 text-gray-400 text-xs uppercase">Or continue with</span>
          <div className="grow border-t border-gray-300"></div>
        </div>
  )
}
