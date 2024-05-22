//This will show the "prefers-color-scheme" value for this browser, reactively

import { useEffect, useState } from "react"

//NOTE: Hook functions must use camel case because of linting rules.
export const usePrefersDarkMode = () => {

  const [prefersDarkMode, setPrefersDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  )

  useEffect(() => {
    function handleDarkModePrefferedChange() {
      const doesMatch = window.matchMedia("(prefers-color-scheme: dark)").matches
      setPrefersDarkMode(doesMatch)
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleDarkModePrefferedChange)
    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleDarkModePrefferedChange)
    }
  }, [])

  return prefersDarkMode
}