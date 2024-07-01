import LucideIcon from '@/components/common/LucideIcon'

function AppLogo({ containerClasses = 'text-center my-6' }) {
  return (
    <div className={containerClasses}>
      <div className="relative">
        <LucideIcon name="Airplay" size={40} />
      </div>
    </div>
  )
}

export default AppLogo
