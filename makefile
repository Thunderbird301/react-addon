NAME:=react-test
NAME_XPI:=$(NAME).xpi
XPI_SRC:=$(shell find content -type f) $(shell find modules -type f) $(shell find defaults -type f)
SRC = $(wildcard react/*.jsx)
LIB = $(SRC:react/%.jsx=modules/react/%.js)

all: react xpi

modules/react:
	mkdir -p $(@D)

modules/react/%.js: react/%.jsx
ifeq (, $(shell which node ))
	nodejs node_modules/.bin/babel $< -o $@ --presets react
else
	node node_modules/.bin/babel $< -o $@ --presets react
endif

react: npm modules/react $(LIB)
xpi: $(NAME_XPI)

$(NAME_XPI): $(XPI_SRC) $(LIB) chrome.manifest  install.rdf
	zip -r $@ $^

npm: node_modules
node_modules: package.json
	npm install

clean:
	rm -f $(LIB)
	rm -f $(NAME_XPI)

rebuild: clean all
