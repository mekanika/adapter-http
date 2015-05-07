0.3.0 - 7 May 2015
=====

Added:

- Expose request agent on .driver on module

Changed:

- Only emit event if `res` is present on return
- Fix parser to only parse endpoint if cfg.parse
- Adapter is now an event emitter
- Exclude URL generator from ‘parse’ config
- Adapter results are `res` NOT superagent object

Internal:

- tests: Fix old empty() style bdd expect
- Ensure adapter results pass obj or null



0.2.0 - 30 March 2015
=====

Roughly a complete rewrite to simplify down to basic POST of Qe.

Added:

- Built output is provided in npm module in /dist

Changed:

- Default HTTP METHOD is now POST

Removed:

- Minified build version from repo (provided in npm module)
- Most of the library itself :)

Internal:

- Switch to npm for build system
- Switch to Chai for testing




0.1.1 - 3 December 2013
=====

- Initial release (with adapter-rest.min.js)
