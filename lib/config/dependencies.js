'use strict';

const { execSync: exec } = require('child_process');
const { error, print, strong } = require('../utils/cnsl');
const { resolve } = require('../resolver');
const fs = require('fs');
const path = require('path');

const useNPM = !fs.existsSync(path.resolve('yarn.lock'));

module.exports = {
  find,
  install
};

/**
 * Resolve dependency filepath from 'id'
 * @param {String} id
 * @returns {String}
 */
function find(id) {
  let filepath = '';

  if ('string' == typeof id) {
    try {
      // Resolve relative to buddy package
      filepath = require.resolve(id);
    } catch (err) {
      // Resolve relative to project package
      filepath = resolve(path.resolve('package.json'), id);
    }
  }

  return filepath;
}

/**
 * Install dependencies based on 'ids'
 * @param {Array} ids
 */
function install(ids) {
  if (!ids || !ids.length) return;

  const missingDependencies = ids.filter(id => find(id) == '');

  if (missingDependencies.length) {
    try {
      const cmd = useNPM
        ? `npm --save-dev --save-exact install ${missingDependencies.join(' ')}`
        : `yarn add --dev --exact ${missingDependencies.join(' ')}`;

      print('installing the following missing dependencies:', 0);
      missingDependencies.forEach(id => {
        print(strong(id), 1);
      });
      exec(cmd);
    } catch (err) {
      error(err);
    }
  }
}
