#! /usr/bin/env node

import path from 'path'

import fs from 'fs/promises'

import { getUserInput } from '../src/cli.js'
import { getFilesForPaths } from '../src/fileUtils.js'
import convertFile from '../src/frontmatter.js'

const add = async () => {
  const { paths, outdir } = getUserInput()

  const files = await getFilesForPaths(paths)

  const converted = await Promise.all(
    await files.map(async file => {
      const content = await convertFile(`${file.sectionPath}/${file.filePath}`)
      return { ...file, content }
    }),
  )

  try {
    await converted.map(async item => {
      const fullPath = `${outdir}/${item.sectionPath}/${item.filePath}`
      const name = path.basename(fullPath) === 'index.md' ? '_index.md' : path.basename(fullPath)

      const toPath = path.dirname(fullPath)
      const writePath = `${toPath}/${name}`

      await fs.mkdir(toPath, { recursive: true })
      await fs.writeFile(writePath, item.content)
      console.log(`Creating: ${writePath}`)
    })
  } catch (err) {
    console.error(err)
  }
}

add()
