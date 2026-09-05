#!/usr/bin/env node
import Pastel from 'pastel'
import { meta } from './here.ts'

const app = new Pastel({
  importMeta: meta,
  name: 'bento-get',
})

app.run().catch((error) => {
  console.error(error)
  process.exit(1)
})
