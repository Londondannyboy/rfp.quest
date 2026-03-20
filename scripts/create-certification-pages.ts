#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

// Create all certification page directories
const certPages = [
  'iso-27001-uk-tenders',
  'cyber-essentials-uk-tenders', 
  'iso-9001-uk-tenders',
  'iso-14001-uk-tenders',
  'iso-45001-uk-tenders',
  'cyber-essentials-plus-uk-tenders',
  'chas-uk-tenders',
  'constructionline-uk-tenders',
  'safecontractor-uk-tenders',
  'ssip-uk-tenders',
  'dsp-toolkit-nhs-tenders',
  'pas-91-uk-tenders',
  'sfg20-uk-tenders',
  'ai-certification-uk-public-sector'
]

async function createDirectories() {
  const baseDir = path.join(process.cwd(), 'src/app/certifications')
  
  for (const page of certPages) {
    const dirPath = path.join(baseDir, page)
    try {
      await fs.mkdir(dirPath, { recursive: true })
      console.log(`✅ Created directory: ${page}`)
    } catch (error) {
      console.log(`Directory already exists: ${page}`)
    }
  }
}

createDirectories().catch(console.error)