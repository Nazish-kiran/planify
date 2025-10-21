'use client'
import { useState } from 'react'
import { useTheme } from './ThemeProvider'

const themes = [
  { value: 'dark', icon: 'far fa-moon', label: 'Dark' },
  { value: 'light', icon: 'far fa-sun', label: 'Light' },
  { value: 'ocean', icon: 'fas fa-water', label: 'Ocean' },
  { value: 'sunset', icon: 'fas fa-cloud-sun', label: 'Sunset' },
  { value: 'forest', icon: 'fas fa-tree', label: 'Forest' },
  { value: 'royal', icon: 'fas fa-crown', label: 'Royal' },
  { value: 'cyber', icon: 'fas fa-bolt', label: 'Cyber' }
]

export default function ThemeDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentTheme, changeTheme } = useTheme()
  
  const currentThemeConfig = themes.find(theme => theme.value === currentTheme)

  const handleThemeChange = (theme) => {
    changeTheme(theme)
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      <button 
        className="inline-flex btn justify-between items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          <i className={currentThemeConfig?.icon}></i> {currentThemeConfig?.label}
        </span>
        <i className="fa-solid fa-chevron-down ml-2 text-gray-500"></i>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full min-w-max bg-[rgba(255,255,255,0.08)] border border-gray-200 rounded-md shadow-lg" id='dropdownMenu'>
          <ul className="py-1">
            {themes.map((theme) => (
              <li 
                key={theme.value}
                className="px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100"
                onClick={() => handleThemeChange(theme.value)}
              >
                {theme.label} <i className={theme.icon}></i>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}