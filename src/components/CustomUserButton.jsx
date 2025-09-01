// Create a new component: components/CustomUserButton.jsx
import React from 'react'
import { UserButton } from '@clerk/clerk-react'
import { Package } from 'lucide-react'

const CustomUserButton = () => {
  return (
    <UserButton 
      afterSignOutUrl="/"
      userProfileProps={{
        additionalOAuthScopes: {
          google: ['email', 'profile']
        }
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="My Orders"
          labelIcon={<Package size={16} />}
          href="/orders"
        />
        <UserButton.Action label="manageAccount" />
        <UserButton.Action label="signOut" />
      </UserButton.MenuItems>
    </UserButton>
  )
}

export default CustomUserButton