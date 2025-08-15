import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { LanguageLabel, useRunner } from '../module'

export default function LanguageSelector() {
  const language = useRunner((state) => state.language)
  const setLanguage = useRunner((state) => state.setLanguage)

  return (
    <Dropdown onSelect={(eventKey) => setLanguage(eventKey)}>
      <Dropdown.Toggle variant="light" id="dropdown-basic">
        {LanguageLabel[language]}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {Object.keys(LanguageLabel).map((lang) => (
          <Dropdown.Item key={lang} eventKey={lang}>
            {LanguageLabel[lang]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}
