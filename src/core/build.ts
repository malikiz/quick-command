import fs from 'fs'
import manifestOriginal from '../../public/manifest.json'
import path from 'path'

const startPath = './'

const buildManifest = () => {
  console.info('manifest.json building')
  const manifestPath = path.join(startPath, 'build/manifest.json')

  fs.readFile(manifestPath, 'utf8', (error, data) => {
    if (error) {
      throw error
    }

    const manifestJson: typeof manifestOriginal = JSON.parse(data)

    /* Set js files in manifest */
    const jsFiles = fs.readdirSync(path.join(startPath, 'build/static/js'))
    manifestJson.content_scripts[0].js = []
    jsFiles.forEach(file => {
      const filename = path.join(startPath, `build/static/js/${file}`)
      const stat = fs.statSync(filename)

      if (!stat.isDirectory()) {
        if (filename.endsWith('.js')) {
          manifestJson.content_scripts[0].js.push(filename.replace(/\\/g, '/').replace('build/', ''))
        }
      }
    })

    /* Set css files in manifest */
    const cssFiles = fs.readdirSync(path.join(startPath, 'build/static/css'))
    manifestJson.content_scripts[0].css = []
    cssFiles.forEach(file => {
      const filename = path.join(startPath, `build/static/css/${file}`)
      const stat = fs.statSync(filename)

      if (!stat.isDirectory()) {
        if (filename.endsWith('.css')) {
          manifestJson.content_scripts[0].css.push(filename.replace(/\\/g, '/').replace('build/', ''))
        }
      }
    })

    fs.writeFileSync(manifestPath, JSON.stringify(manifestJson, null, '\t'))

    console.info('manifest.json building was successful')
  })
}

buildManifest()