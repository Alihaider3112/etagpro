import Link from 'next/link'
import LucideIcon from '@/components/common/LucideIcon'

export default function PageHeader({
  TopBarContent,
  customClass,
}) {
  return (
    <div
      className={`py-3 pl-5 pr-2 bg-white border-t-0 border-b border-l-0 border-r-0 border-gray-200 border-solid w-100 ${customClass}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1 mb-0 min-h-9">
            {TopBarContent?.backPath && (
              <Link
                className="flex items-center gap-1 text-gray-500 no-underline hover:bg-gray-200 hover:rounded-full"
                href={TopBarContent?.backPath || ''}
              >
                <LucideIcon
                  name="ChevronLeft"
                  size={23}
                  wrap="p-1 text-black"
                />
              </Link>
            )}
            {TopBarContent?.pageTitle}
          </div>
          <p className="mb-0 text-xs empty:hidden text-slate-600">
            {TopBarContent.description}
          </p>
        </div>
      </div>
    </div>
  )
}
