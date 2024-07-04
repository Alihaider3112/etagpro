import Router from 'next/router'
import { message,Button } from 'antd'
import { IDA_TOKEN } from '@/constants/constant'
import MoreActions from '@/components/common/MoreActions'
import UserAvatar from '@/components/common/UserAvatar'
import LucideIcon from '@/components/common/LucideIcon'

const ACTION_ITEMS = [
  {
    id: 1,
    key: 'Logout',
    label: 'Logout',
    danger: true,
    icon: <LucideIcon name="LogOut" size={14} wrap="mr-1" />
  }
]

function UserAccount() {
  return (
    <div className="flex items-center justify-between gap-2 px-5 text-sm text-red-600 no-underline rounded-md group">
      <div className="flex flex-col items-center gap-3 pl-1 text-gray-700">
        <MoreActions
          items={ACTION_ITEMS}
          overlayClassName="w-48"
          icon="add"
          placement="topRight"
          hoverClass="bg-white hover:bg-gray-200 border border-solid p-1 h-12 w-12 border-gray-200 rounded-full"
          iconStyle="text-gray-600 rounded-circle text-3xl"
          onActionItemClick={async item => {
            const { key } = item
            if (key === 'Logout') {
              localStorage.removeItem(IDA_TOKEN)
              Router.push('/')
            } else {
              message.info('Coming soon. Stay tuned.')
            }
          }}
        >
          <a>
            <UserAvatar
              size={40}
              styles="bg-primary !rounded text-white"
            />
          </a>
        </MoreActions>
      </div>
    </div>
  )
}

export default UserAccount
