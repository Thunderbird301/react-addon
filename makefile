NAME:=react-test
NAME_XPI:=$(NAME).xpi
XPI_SRC:=$(wildcard content/*) $(wildcard modules/*) $(wildcard defaults/*)
SRC = $(wildcard react/*.jsx)
LIB = $(SRC:react/%.jsx=modules/react/%.js)

all: npm react xpi 

modules/react/%.js: react/%.jsx
	mkdir -p $(@D)
	node_modules/.bin/babel $< -o $@ --presets react 

react: $(LIB)
xpi: $(NAME_XPI)

$(NAME_XPI): $(XPI_SRC) chrome.manifest  install.rdf
	zip -r $@ $^

npm: package.json
	npm install

clean:
	rm $(LIB)
	rm $(NAME_XPI)
