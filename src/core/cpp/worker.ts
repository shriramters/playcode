import { API } from './api'

let api: API
let port: MessagePort

const apiOptions = {
  hostWrite(s: string) {
    port.postMessage({ id: 'write', data: s })
  },
}

let currentApp = null

const onAnyMessage = async (event) => {
  switch (event.data.id) {
    case 'constructor':
      port = event.data.data
      port.onmessage = onAnyMessage
      api = new API(apiOptions)
      break

    case 'setShowTiming':
      api.showTiming = event.data.data
      break

    case 'compileLinkRun':
      currentApp = await api.compileLinkRun(event.data.data)
      console.log(`finished compileLinkRun. currentApp = ${currentApp}.`)
      break

    case 'getTestFiles':
      try {
        const { numTests } = event.data.data
        const testFiles = {}
        
        // Read test output files from memfs
        for (let i = 1; i <= numTests; i++) {
          const fileName = `test_output_${i}.txt`
          const filePath = `/${fileName}`
          
          try {
            const fileContents = api.memfs.getFileContents(filePath)
            testFiles[fileName] = new TextDecoder().decode(fileContents)
          } catch (error) {
            console.log(`Could not read ${fileName}: ${error.message}`)
            testFiles[fileName] = ''
          }
        }
        
        port.postMessage({ 
          id: 'testResults', 
          data: { testFiles, error: null } 
        })
      } catch (error) {
        port.postMessage({ 
          id: 'testResults', 
          data: { testFiles: {}, error: `Failed to read test files: ${error.message}` } 
        })
      }
      break
  }
}

self.addEventListener('message', onAnyMessage)
