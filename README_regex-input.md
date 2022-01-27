# `<regex-input>`

`<regex-input>` is a web component that allows users to enter regular expressions and have them validated immediatly to ensure they are valid.

It also has an optional sample test user interface which provides a modal where users can modify the regex & test it against a sample block of text.

-----

## Attriubtes

### `pattern` *{string}*

__Default:__ "" *(empty string)*

The regular expression pattern provided by the client.

The `pattern` attribute is updated whenever the user changes the `pattern` and the resulting regex is valid.

### `flags` *{string}*

__Default:__ "" *(empty string)*

Regular expression flags (aka pattern modifiers) provided by the client.

Flags allow the user to alter the behaviour of the regex.

By default `<regex-input>` uses the browser's built in ECMAscript/javascript `RegExp` engine so invalid flags are stripped out as they are typed and an error message is shown for each. Likewise duplicate flags are also removed.

The `flags` attribute is updated whenever the user changes the `flags` and the resulting list of flags is valid.

### `flagstate` *{string}*

__Default:__ `show`

Flag state allows the client to either show, disable or hide flags depending on requirements.

Valid values:
* _`show`_: Flags input is visible and can be changed
* _`disable`_ or _`disabled`_: Flags input is visible but cannot be changed by the user
* _`hide`_: User cannot see the flags input at all

The ID of the label linked to the input field.

### `allowedflags` *{string}*

__Default:__ "" *(empty string)*

String of regex engine flags (aka pattern modifiers) the user is allowed to enter.

List of flags the user is allowed to enter. By default, this can be a subset (or complete set) of flags allowed by the browser's RegExp engine. (This list will be filtered to remove any flags not supported by the browsers RegExp engine.)

__NOTE:__ If [notjs](#notjs) is set to `TRUE` it can be a list of any number of unique alphabetical-numeric characters the client supplies.


### `regexerror` *{string}*

__Default:__ "" *(empty string)*

If `<regex-input>` is being used an external regex engine, then this allows the client to provide an error message supplied by the external engine.

### `maxlength` *{number}*

__Default:__ `512`

The maximum character length of the regular expression can be

### `labelid` *{string}*

__Default:__ "" *(empty string)*

ID of the field label intended to describe this web component.

### `notjs` *{boolean}*

__Default:__ `false`

If the input is being used for an external regex engine (e.g. PHP PCRE) this will change how flags are filtered and allow the client to supply custom flags appropriate to the regex engine.

### `nodelims` *{boolean}*

__Default:__ `false`

Whether or not to hide regular expression delimiter characters from the user.

### `delim` *{string}*

__Default:__ `/`

__NOTE:__ If [notjs](#notjs) is `FALSE` *(default)* this attribute is ignored.

Regular expression delimiter character used when rendering the input to make it clearer what the UI is for.

__NOTE:__ If [notjs](#notjs) is set to `TRUE` it can be any single non-alpha-numeric, non-backslash or non-whitespace character.

### `pairddelims` *{boolean}*

__Default:__ `false`

__NOTE:__ If [notjs](#notjs) is `FALSE` *(default)* this attribute is ignored.

Some regular expression engines (like PHP PCRE) allow paird delimiters (e.g. `<` & `>`).<br />
If `pairddelims` is a character that can be a paired delimiter then the paired characters will be used as opening and closing delimiters. e.g. `(^[a-z]+$)is`.

### `showlabels` *{boolean}*

__Default:__ `false`

For accessibility reasons, both the pattern and flags fields have labeled but they are hidden from the screen. By setting `showlabels` to `TRUE` the field labels will be visible to everybody.

### `disabled` *{boolean}*

__Default:__ `false`

If `<regex-input>` is used conditionally within a form sometimes it's useful for the user to be able to see it but not be allowed to edit it. This sets both pattern and flags input fields to be set to disabled.

### `testable` *{boolean}*

__Default:__ `false`

It's often useful for the user to be able to test their regex pattern against a sample input (or list of sample inputs). If `testable` is `TRUE` a "Test" button will be rendered after the input fields. When the "Test" button is clicked, a modal will be rendered with the pattern & flags fields along with a sample text box.

Because it's often useful to test multiple samples against your pattern, it's possible to split the sample on new lines.

When you are matching a whole string, you probably don't want leading or trailing white space so it's also possible to trim the leading & trailing whitespace from each sample.

-----

## Styling

To help make `<regex-input>` easier to integrate into applications there are a number of css custom properties that allow the client application to define various style properties.

* `--ri-font-size` - 1rem
* `--ri-border-radius` - *(default: 0.9rem)* - Used for buttons, error message box and patter/flag input wrapper
* `--ri-text-colour` - *(default: rgb(255, 255, 255))*
* `--ri-bg-colour` - *(default: rgb(0, 85, 34))*;
* `--ri-error-bg-colour` - *(default: rgb(150, 0, 0))* - Background colour for regular expression errors
* `--ri-error-text-colour` - *(default: rgb(255, 255, 255))* - Text colour for regular expression errors
* `--ri-line-width` - *(default: 0.075rem)* - Border thickness;
* `--ri-max-width` - *(default: 30rem)* Maximum with of pattern input field;
* `--ri-default-input-font` - *(default: 'Courier New', Courier, monospace)*
* `--ri-input-font` - *(default: 'Courier New', Courier, monospace)* - Font family used for input fields

### Accessibility - outline styles

Styling to identify an input field is in focus

* `--ri-outline-width` - *(default: 0.25rem)* - width of the field outline
* `--ri-outline-style` - *(default: dotted)*; - line style for outline
* `--ri-outline-offset` - *(default: 0.2rem)* - space around the field (between the outline and the field)