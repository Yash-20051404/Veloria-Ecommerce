import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { USER_ROLES } from '@/types/roles'

const roles = [USER_ROLES.BUYER, USER_ROLES.SELLER, USER_ROLES.ADMIN]

export function RoleSwitcher() {
  const { role, setRole } = useAuth()

  return (
    <div className="flex flex-wrap items-center gap-3">
      {roles.map((item) => (
        <Button
          key={item}
          variant={role === item ? 'default' : 'outline'}
          onClick={() => setRole(item)}
        >
          Switch to {item}
        </Button>
      ))}
    </div>
  )
}
