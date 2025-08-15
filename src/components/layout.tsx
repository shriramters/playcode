import React from 'react'
import useMedia from 'use-media'

interface LayoutProps {
  header: React.ReactNode
  left: React.ReactNode
  right: React.ReactNode
}

export default function Layout(props: LayoutProps) {
  const { header, left, right } = props
  const isWide = useMedia({ minWidth: '800px' })
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <header className="flex-shrink-0 shadow-md z-10">{header}</header>
      <div className={`flex-grow h-full overflow-hidden ${!isWide ? 'flex-col' : 'flex-row'} flex`}>
        <div className="flex-1">{left}</div>
        <div className="w-2 bg-dark-700"></div>
        <div className="flex-1">{right}</div>
      </div>
    </div>
  )
}
