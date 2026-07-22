'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function SeoInternalLinker() {
  const pathname = usePathname()
  const [links, setLinks] = useState(null)

  // Fetch all configured internal links once on mount
  useEffect(() => {
    if (pathname?.startsWith('/admin')) return

    let active = true
    async function fetchLinks() {
      try {
        const res = await fetch('/api/seo-internal-links')
        if (!res.ok) return
        const data = await res.json()
        if (active && Array.isArray(data)) {
          setLinks(data)
        }
      } catch (err) {
        console.error('Failed to load SEO internal links:', err)
      }
    }

    fetchLinks()
    return () => {
      active = false
    }
  }, [])

  // Process text nodes to inject links
  useEffect(() => {
    if (pathname?.startsWith('/admin') || !links || links.length === 0) return

    // Create a lookup map of lowercase keywords
    const linksMap = {}
    for (const item of links) {
      if (item.keyword?.trim() && item.target_url?.trim()) {
        linksMap[item.keyword.trim().toLowerCase()] = item
      }
    }

    // Sort keywords by length descending so longer keywords match first
    const sortedKeywords = Object.keys(linksMap).sort((a, b) => b.length - a.length)
    if (sortedKeywords.length === 0) return

    // Escape regex characters
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    // Build regex pattern matching exact word boundaries for any keyword
    const pattern = sortedKeywords.map(k => `\\b${escapeRegExp(k)}\\b`).join('|')
    const regex = new RegExp(pattern, 'gi')

    const ignoreTags = [
      'A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SCRIPT', 'STYLE', 'SELECT', 'OPTION',
      'SVG', 'PATH', 'CIRCLE', 'RECT', 'G', 'TEXT', 'HEAD', 'META', 'LINK',
      'TITLE', 'NOSCRIPT', 'IFRAME'
    ]

    function processTextNode(node) {
      const text = node.nodeValue
      if (!text || !text.trim()) return

      // Reset regex index
      regex.lastIndex = 0
      if (!regex.test(text)) return

      // Find all matches and build a fragment
      const parent = node.parentNode
      if (!parent) return

      regex.lastIndex = 0
      let match
      let lastIndex = 0
      const fragment = document.createDocumentFragment()
      let hasChanges = false

      while ((match = regex.exec(text)) !== null) {
        const matchText = match[0]
        const matchIndex = match.index

        // Add preceding text
        if (matchIndex > lastIndex) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchIndex)))
        }

        // Add the anchor element
        const keywordLower = matchText.toLowerCase()
        const linkInfo = linksMap[keywordLower]
        if (linkInfo) {
          const a = document.createElement('a')
          a.href = linkInfo.target_url
          a.textContent = matchText // Preserve original case
          a.className = 'seo-internal-link underline decoration-gold-metallic/35 hover:text-gold-metallic hover:decoration-gold-metallic transition-all duration-200 cursor-pointer'
          if (linkInfo.open_in_new_tab) {
            a.target = '_blank'
            a.rel = 'noopener noreferrer'
          }
          fragment.appendChild(a)
          hasChanges = true
        } else {
          fragment.appendChild(document.createTextNode(matchText))
        }

        lastIndex = regex.lastIndex

        // Prevent infinite loops with zero-width matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++
        }
      }

      // Add remaining text
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)))
      }

      if (hasChanges) {
        parent.replaceChild(fragment, node)
      }
    }

    function walkDOM(node) {
      // Ignore ignored elements
      if (node.nodeType === 1 && ignoreTags.includes(node.tagName)) {
        return
      }

      // Ignore admin elements
      if (node.nodeType === 1) {
        if (node.id === 'admin-dashboard' || (node.className && typeof node.className === 'string' && node.className.includes('admin'))) {
          return
        }
      }

      const children = Array.from(node.childNodes)
      for (const child of children) {
        if (child.nodeType === 3) {
          processTextNode(child)
        } else if (child.nodeType === 1) {
          walkDOM(child)
        }
      }
    }

    let isRunning = false

    function applyReplacements() {
      if (isRunning) return
      isRunning = true

      if (observer) {
        observer.disconnect()
      }

      walkDOM(document.body)

      if (observer) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        })
      }

      isRunning = false
    }

    let debounceTimeout = null
    const observer = new MutationObserver(() => {
      if (debounceTimeout) clearTimeout(debounceTimeout)
      debounceTimeout = setTimeout(() => {
        applyReplacements()
      }, 150)
    })

    // Perform initial replacement
    applyReplacements()

    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout)
      observer.disconnect()
    }
  }, [links, pathname])

  return null
}
