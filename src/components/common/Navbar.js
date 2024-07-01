import Link from 'next/link'
import { useRouter } from 'next/router'
import { classNames } from '@/constants/utils'
import LucideIcon from '@/components/common/LucideIcon'

export default function Navbar({ isMobile }) {
  const route = useRouter()
  const { pathname } = route

  // TODO: move to separate file with component
  const navigation = [
    {
      id: '1',
      name: 'Products',
      href: '#',
      url: '/products',
      icon: 'Warehouse',
      current: pathname.includes('/products') // there's got to be the better way
    },
    {
      id: '2',
      name: 'Models',
      href: '#',
      url: '/models',
      icon: 'Component',
      current: pathname.includes('/models') // there's got to be the better way
    },
    {
      id: '3',
      name: 'Companies',
      href: '#',
      url: '/companies',
      icon: 'Hexagon',
      current: pathname.includes('/companies') // there's got to be the better way
    }
  ]

  return (
    <>
      {navigation.map(item => (
        <>
          {isMobile ? (
            <Link
              key={item.id}
              href={item.url}
              className={classNames(
                item.current
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center rounded-md px-2 py-2 text-base font-medium leading-5'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? 'text-gray-500'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'mr-3 h-6 w-6 flex-shrink-0'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ) : (
            <Link
              key={item.id}
              href={item.url}
              className="flex flex-col items-center gap-1 py-2 text-sm font-medium text-gray-700 no-underline rounded-md group"
              aria-current={item.current ? 'page' : undefined}
            >
              <div
                className={classNames(
                  item.current
                    ? 'bg-primary-soft text-primary'
                    : 'text-gray-700',
                  'flex flex-col gap-0 items-center rounded-md no-underline px-3 py-2 text-sm font-medium group-hover:text-[var(--primary-color)] group-hover:bg-[var(--primary-color-soft)]'
                )}
              >
                <LucideIcon name={item.icon} size={22} />
              </div>
              <span
                className={classNames(
                  item.current ? 'text-primary' : 'text-gray-700',
                  'text-[13px] group-hover:text-[var(--primary-color)]'
                )}
              >
                {item.name}
              </span>
            </Link>
          )}
        </>
      ))}
    </>
  )
}
