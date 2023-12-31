import matter from 'gray-matter'

import { getFileContents, getFileWeight } from './fileUtils.js'
import { isEmpty } from './utils.js'

const buildFrontMatter = (params = []) => {
  const delim = ['---\n']

  const fm = [...delim, ...params, ...delim]

  return fm.join('')
}

const getTitle = content => {
  const h1 = /^#\s.+/

  const header = content.find(el => el.match(h1))
  const title = header.replace('# ', '')
  const body = content.filter(el => !el.match(header))

  return [title, body]
}

const buildFrontmatterValues = (pageTitle, keyList, fileWeight) => {
  const frontMatterValues = { title: pageTitle }

  if (!isEmpty(fileWeight)) {
    frontMatterValues.weight = fileWeight
  }

  for (const [key, value] of Object.entries(keyList)) {
    if (fmList.includes(key)) {
      frontMatterValues[key] = value
      continue
    }
    if (key === 'sidebar_position') {
      frontMatterValues['weight'] = value
    }
  }

  return frontMatterValues
}

const convertFile = async inputFile => {
  const fileContents = await getFileContents(inputFile)
  const fmData = matter(fileContents)
  const fileBody = fmData.content.split('\n')

  const [title, body] = getTitle(fileBody)
  const fileWeight = getFileWeight(inputFile)

  const frontMatterValues = buildFrontmatterValues(title, fmData.data, fileWeight)

  const frontmatterList = []
  for (const [key, value] of Object.entries(frontMatterValues)) {
    frontmatterList.push(`${key}: ${value}\n`)
  }

  const frontMatter = buildFrontMatter(frontmatterList)

  return `${frontMatter}${body.join('\n')}`
}

const fmList = [
  'aliases',
  'audio',
  'cascade',
  'date',
  'description',
  'expiryDate',
  'headless',
  'images',
  'isCJKLanguage',
  'keywords',
  'lastmod',
  'layout',
  'linkTitle',
  'markup',
  'outputs',
  'publishDate',
  'resources',
  'slug',
  'title',
  'type',
  'url',
  'videos',
  'weight',
]
export default convertFile
