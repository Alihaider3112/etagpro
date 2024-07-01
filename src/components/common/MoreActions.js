import React from 'react'
import { Dropdown, Space } from 'antd'
import LucideIcon from '@/components/common/LucideIcon'

export default function MoreActions({
  icon = 'more_vert',
  items,
  placement = 'bottom',
  onActionItemClick,
  overlayClassName = 'w-50',
  hoverClass = 'hover:bg-gray-200 rounded-full h-8 w-8 p-1',
  children
}) {
  return (
    <Space wrap>
      <Dropdown
        menu={{ items, onClick: onActionItemClick }}
        arrow={{ pointAtCenter: true }}
        trigger={['click']}
        placement={placement}
        openClassName="dd-opened"
        overlayClassName={overlayClassName}
      >
        {children || (
          <a
            className={`${hoverClass} flex items-center justify-center cursor-pointer transition-all`}
            onClick={e => e.preventDefault()}
          >
            <LucideIcon
              name={icon?.name}
              size={icon?.size}
              wrap={icon?.wrap}
            />
          </a>
        )}
      </Dropdown>
    </Space>
  )
}

MoreActions.defaultProps = {
  toggleClassName: ''
}
