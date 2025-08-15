import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { LanguageLabel, useRunner } from '../module'
import { useTheme } from '../core/theme'

export default function LanguageSelector() {
  const language = useRunner((state) => state.language)
  const setLanguage = useRunner((state) => state.setLanguage)
  const theme = useTheme((state) => state.theme)

  return (
    <Dropdown onSelect={(eventKey) => setLanguage(eventKey)}>
      <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
        {LanguageLabel[language]}
      </Dropdown.Toggle>

      <Dropdown.Menu data-bs-theme={theme}>
        {Object.keys(LanguageLabel).map((lang) => (
          <Dropdown.Item key={lang} eventKey={lang}>
            {LanguageLabel[lang]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}
