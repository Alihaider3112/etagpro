import Link from 'next/link'

function Account({
  heading, subHeading, showBackToLogin, children,
}) {
  return (
    <>
      <h2 className="font-medium text-xl text-left my-4">{heading}</h2>
      {subHeading && <p className="mb-4 font-normal text-sm">{subHeading}</p>}
      <div className="flex flex-col relative w-full max-w-xs">
        {children}
        {showBackToLogin && (
          <div className="text-center text-sm mt-4 py-2">
            <div className="flex items-center gap-1 justify-center">
              <span>Already have an account?</span>
              <Link className="login-form-forgot text-sm inline-block" href="/">
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Account
