'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme') || 'dark'
    setCurrentTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    document.body.classList.add('theme-transition')
    setTimeout(() => document.body.classList.remove('theme-transition'), 500)
  }

  const changeTheme = (theme) => {
    setCurrentTheme(theme)
    applyTheme(theme)
    localStorage.setItem('app_theme', theme)
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)