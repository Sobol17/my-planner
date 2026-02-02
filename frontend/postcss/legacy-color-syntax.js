const normalizeLegacyArgs = value => {
  if (value.includes('var(') || value.includes(',')) {
    return value
  }

  const parts = value.trim().split(/\s+/)
  if (parts.length <= 1) return value

  return parts.join(', ')
}

const replaceSlashFunction = (value, fnName, replacement) => {
  const needle = `${fnName}(`
  let output = ''
  let cursor = 0

  while (cursor < value.length) {
    const idx = value.indexOf(needle, cursor)
    if (idx === -1) {
      output += value.slice(cursor)
      break
    }

    output += value.slice(cursor, idx)

    const start = idx + needle.length
    let depth = 1
    let end = start

    while (end < value.length && depth > 0) {
      const ch = value[end]
      if (ch === '(') depth += 1
      else if (ch === ')') depth -= 1
      end += 1
    }

    if (depth !== 0) {
      output += value.slice(idx)
      break
    }

    const inner = value.slice(start, end - 1)
    let slashIndex = -1
    let nested = 0

    for (let i = 0; i < inner.length; i += 1) {
      const ch = inner[i]
      if (ch === '(') nested += 1
      else if (ch === ')') nested -= 1
      else if (ch === '/' && nested === 0) {
        slashIndex = i
        break
      }
    }

    if (slashIndex === -1) {
      output += value.slice(idx, end)
      cursor = end
      continue
    }

    const left = normalizeLegacyArgs(inner.slice(0, slashIndex).trim())
    const right = inner.slice(slashIndex + 1).trim()

    output += `${replacement}(${left}, ${right})`
    cursor = end
  }

  return output
}

const legacyColorSyntax = () => ({
  postcssPlugin: 'legacy-color-syntax',
  Declaration(decl) {
    if (
      !decl.value ||
      (!decl.value.includes('rgb(') && !decl.value.includes('hsl('))
    ) {
      return
    }

    let nextValue = replaceSlashFunction(decl.value, 'rgb', 'rgba')
    nextValue = replaceSlashFunction(nextValue, 'hsl', 'hsla')

    if (nextValue !== decl.value) {
      decl.value = nextValue
    }
  }
})

legacyColorSyntax.postcss = true

module.exports = legacyColorSyntax
