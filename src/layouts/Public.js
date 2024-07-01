export default function Public({ children }) {
  return (
    <div className="flex flex-col bg-body min-h-screen relative overflow-hidden">
      <div className="fixed top-0 right-0 left-0 bottom-0 h-100 w-100 z-10 overflow-hidden" />
      <div className="flex flex-col flex-1 w-full h-full mt-8 items-center justify-center z-20 relative">
        <div className="grid w-full h-full">
          <div className="grid-overlay flex justify-center">
            <div className="m-4 flex flex-col items-center w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
