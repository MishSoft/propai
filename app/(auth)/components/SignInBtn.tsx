import React from 'react'
import { CgSpinner } from 'react-icons/cg'

export default function SignInBtn({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`
            relative w-full py-3 text-white rounded-xl font-semibold transition-all duration-200
            flex items-center justify-center gap-2
            ${loading
          ? "bg-purple-400 cursor-not-allowed"
          : "bg-purple-600 hover:bg-purple-700 active:scale-[0.98] shadow-md shadow-purple-100"}
          `}
    >
      {loading ? (
        <>
          <CgSpinner className="animate-spin" size={20} />
          <span>Creating Account...</span>
        </>
      ) : (
        "Sign Up"
      )}
    </button>
  )
}
