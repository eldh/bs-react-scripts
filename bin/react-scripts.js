#!/usr/bin/env node
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})
const concurrently = require('concurrently')

const spawn = require('react-dev-utils/crossSpawn')
const args = process.argv.slice(2)

const scriptIndex = args.findIndex(
  x => x === 'build' || x === 'eject' || x === 'start' || x === 'test'
)
const script = scriptIndex === -1 ? args[0] : args[scriptIndex]
const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : []

// Ugly hack. There are liely nicer ways to solve this.
if (script === 'start') {
  concurrently(
    [
      { name: '🔺', command: 'bsb -make-world -clean-world -w' },
      { name: '🔷', command: 'react-scripts startJs' },
    ],
    {
      prefix: 'name',
      killOthers: ['failure', 'success'],
    }
  ).then(() => process.exit(0), () => process.exit(1))
} else {
  go(script)
}

function go(script) {
  switch (script) {
    case 'build':
    case 'eject':
    case 'startJs':
    case 'test': {
      const args = nodeArgs
        .concat(require.resolve('../scripts/' + script))
        .concat(nodeArgs.slice(scriptIndex + 1))
      console.log('args', args)

      const result = spawn.sync('node', args, { stdio: 'inherit' })
      if (result.signal) {
        if (result.signal === 'SIGKILL') {
          console.log(
            'The build failed because the process exited too early. ' +
              'This probably means the system ran out of memory or someone called ' +
              '`kill -9` on the process.'
          )
        } else if (result.signal === 'SIGTERM') {
          console.log(
            'The build failed because the process exited too early. ' +
              'Someone might have called `kill` or `killall`, or the system could ' +
              'be shutting down.'
          )
        }
        process.exit(1)
      }
      process.exit(result.status)
      break
    }
    default:
      console.log('Unknown script "' + script + '".')
      console.log('Perhaps you need to update react-scripts?')
      console.log(
        'See: https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#updating-to-new-releases'
      )
      break
  }
}
