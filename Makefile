REPORTER = spec
TESTFILES = $(shell find test/ -name '*.test.js')

install:
	@echo "Installing production"
	@npm install --production
	@echo "Install complete"

build: lint
	@NODE_ENV=test mocha --reporter dot $(TESTFILES)
	@browserify lib/adapter-rest.js -o adapter-rest.min.js -s rest
	@uglifyjs adapter-rest.min.js -m -c -o adapter-rest.min.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(TESTFILES)

lint:
	@echo "Linting..."
	@./node_modules/jshint/bin/jshint \
		--config .jshintrc \
		lib/*.js test/*.js

coverage:
	@echo "Generating coverage report.."
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require blanket \
		$(TESTFILES) \
		--reporter html-cov > coverage.html
	@echo "Done: ./coverage.html"

.PHONY: install lint test coverage
