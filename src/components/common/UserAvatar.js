import { Avatar } from 'antd'

function UserAvatar({
  size = 50,
  styles = 'bg-primary-soft rounded-full text-primary',
}) {
  return (
    <Avatar size={size} className={`uppercase ${styles} text-sm font-medium`}>
      AA
    </Avatar>
  )
}

export default UserAvatar
