// @remove-file-on-eject
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict'

const fs = require('fs')
const chalk = require('react-dev-utils/chalk')
const paths = require('../../config/paths')

module.exports = () => {
  return {
    name: 'reason-react-app',
    sources: [
      'src',
      {
        dir: '__tests__',
        type: 'dev',
      },
    ],
    suffix: '.bs.js',
    reason: {
      'react-jsx': 3,
    },
    'package-specs': [
      {
        module: 'commonjs',
        'in-source': true,
      },
    ],
    'bs-dependencies': ['bs-css', '@glennsl/bs-jest', 'reason-react'],
    refmt: 3,
  }
}
