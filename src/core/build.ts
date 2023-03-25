import fs from 'fs'
import manifestOriginal from '../../public/manifest.json'
import path from 'path'

const startPath = './'

const buildManifest = () => {
  console.info('buildManifest STARTED')
  const manifestPath = path.join(startPath, 'build/manifest.json')

  fs.readFile(manifestPath, 'utf8', (error, data) => {
    if (error) {
      throw error
    }

    const manifestJson: typeof manifestOriginal = JSON.parse(data)


    const files = fs.readdirSync(path.join(startPath, 'build/static/js'))

    manifestJson.content_scripts[0].js = []

    files.forEach(file => {
      const filename = path.join(startPath, `build/static/js/${file}`)
      const stat = fs.statSync(filename)

      if (!stat.isDirectory()) {
        if (filename.endsWith('.js')) {
          manifestJson.content_scripts[0].js.push(filename.replace(/\\/g, '/').replace('build/', ''))
        }
      }
    })

    fs.writeFileSync(manifestPath, JSON.stringify(manifestJson, null, '\t'))

    console.info('buildManifest FINISHED')
  })
}

buildManifest()