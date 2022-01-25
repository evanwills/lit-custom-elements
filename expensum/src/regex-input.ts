/** Globals Error */
import { html, css, LitElement, } from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('regex-input')
export class RegexInput extends LitElement {
  /**
   * Predefined RegExp string
   *
   * @var maxlength
   */
  @property({ reflect: true })
  value : string = '';

  /**
   * Predefined RegExp flags
   *
   * @var maxlength
   */
  @property({ reflect: true })
  flags : string = 'ig';

  /**
   * Error generated by an invalid regular expression
   *
   * @var regexError
   */
  @property({ reflect: true })
  regexError : string = '';

  /**
   * RegExp Flags allowed by the client
   *
   * @var maxlength
   */
  @property()
  allowedFlags : string = '';

  /**
   * The maximum number of characters a regular expression is
   * allowed to be
   *
   * @var maxlength
   */
  @property()
  maxlength : number = 512;

  /**
   * ID of the label field used to label the regex input
   *
   * @var labelID
   */
  @property()
  labelID : string = '';

  /**
   * Hide the flags input field
   *
   * @var noFlags
   */
  @property()
  noFlags : boolean = false;

  /**
   * Regex engine is not ECMAscript (e.g. used for PHP PCRE or .Net)
   *
   * This stops the allowedFlags from being validated against normal
   * ECMAscript flags
   *
   * @var notJs
   */
  @property()
  notJs : boolean = false;

  /**
   * Don't show regex delimiters
   *
   * @var noDelims
   */
  @property()
  noDelims : boolean = false;

  /**
   * Regular expression delimiter (for non-JS regex engines)
   *
   * @var delim
   */
  @property()
  delim : string = '/';

  /**
   * Some regex engines allow paird delimiters (e.g. "<" & ">")
   *
   * If your regex engine allows paird delimiters, set this to true
   *
   * @param pairedDelim
   */
  @property()
  pairedDelim = false;

  /**
   * Show input field labels
   *
   * @param showLabels
   */
  @property()
  showLabels = false;

  /**
   * Disable user interaction with input fields
   *
   * @param disabled
   */
  @property()
  disabled = false;

  /**
   * Does the regex have any errors
   *
   * @var hasError
   */
  hasError : boolean = false;

  /**
   * Whole regex string including delimiters & flags
   *
   * @var wholeRegex
   */
  wholeRegex : string = '';

  /**
   * Opening delimiter character
   *
   * (only relevant when used for non JS regex engines)
   *
   * @var _delimOpen
   */
  _delimOpen : string = '/';

  /**
   * Closing delimiter character
   *
   * (only relevant when used for non JS regex engines)
   *
   * @var _delimOpen
   */
  _delimClose : string = '/';

  /**
   * Number REMs wide the regex input field should be
   *
   * @var _regexSize
   */
  _regexSize : number = 1.25;

  /**
   * The number of REMs wide the flags input field should be
   *
   * @var _flagSize
   */
  _flagSize : number = 1.4;

  /**
   * List of allowed regex flags
   *
   * @var _alloweFlags
   */
  _alloweFlags : Array<string> = ['i', 'g', 'd', 'm', 's', 'u', 'y'];

  /**
   * Default placeholder text for flags input
   *
   * @var _placeFlag
   */
  _placeFlag : string = 'i'

  /**
   * List of custom regex flags (if set by the client)
   *
   * @var _customAllowedFlags
   */
  _customAllowedFlags : Array<string> = this._alloweFlags


  /**
   * List of errors generated by invalid or duplicate flag characters
   *
   * @var _flagErrors
   */
  _flagErrors : Array<string> = [];

  /**
   * Whether or not initialisation of functions and values is
   * alrady done
   *
   * @var _initDone
   */
  _initDone : boolean = false;

  static styles = css`
    :host {
      --ri-font-size: 1rem;
      --ri-border-radius: var(--border-radius, 0.9rem);
      --ri-text-colour: var(--txt-colour, #fff);
      --ri-bg-colour: var(--bg-colour, rgb(0, 85, 34));
      --ri-error-bg-colour: var(--error-bg-colour, rgb(150, 0, 0));
      --ri-error-text-colour: var(--error-txt-colour, #fff);
      --ri-line-weight: var(--border-thickness, 0.075rem);
      --ri-max-width: var(--max-regex-width, 30rem);
      --ri-default-input-font: 'Courier New', Courier, monospace;
      --ri-input-font: var(--input-font-family, var(--ri-default-input-font));
      --ri-outline-width: var(--outline-thickness, 0.25rem);
      --ri-outline-style: var(--outline-style, dotted);
      --ri-outline-offset: var(--outline-offset, 0.2rem);

      font-size: 1rem;
      background-color: var(--ri-bg-colour, inherit);
      color:  var(--ri-text-colour, inherit);
      font-family: inherit;
      font-size: inherit;
    }
    .sr-only {
      border: 0;
      clip: rect(0, 0, 0, 0);
      clip-path: inset(100%);
      height: 1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }
    .whole {
      display: block;
    }
    .wrap {
      backgroud-color: var(--ri-bg-colour);
      color: var(--ri-text-colour);
      border: var(--ri-line-weight, 0.05rem) solid var(--ri-text-colour, #ccc);
      border-radius: var(--ri-border-radius);
      display: inline-flex;
      font-size: 1.1rem;
      font-weight: bold;
      overflow: hidden;
      padding: 0.2rem 0.5rem;
    }
    .wrap:focus-within {
      outline-width: var(--ri-outline-width);
      outline-style: var(--ri-outline-style);
      outline-color: var(--ri-text-colour);
      outline-offset: var(--ri-outline-offset);
    }
    .wrap > span {
      font-family: var(--ri-input-font);
    }
    input {
      background-color: var(--ri-bg-colour);
      border: none;
      color: var(--ri-text-colour);
      display: inline-block;
      font-family: var(--ri-input-font);
      font-size: 1.1rem;
      text-align: center;
      transition: width ease-in-out 0.2s;
      max-width: var(--ri-max-width);
      padding: 0;
    }
    .regex-flags {
      width: 4rem;
    }
    .errors {
      margin: -0.5rem 0 0.5rem;
      padding: 0.5rem;
      color: var(--ri-error-text-colour);
      background-color: var(--ri-error-bg-colour);
      border: var(--ri-line-weight) solid var(--ri-error-text-colour);
      border-radius: var(--ri-border-radius);
    }
    .errors ul {
      margin: 0;
      padding: 0;
    }
    .errors li {
      margin: 0.5rem 0 0 1rem;
      padding: 0 0 0 0;
    }
    .errors li:first-child {
      margin-top: 0;
    }
  `;

  //  END:  Property declarations
  // --------------------------------------------
  // START: Private helper methods

  /**
   * Do all the work to initialise everything
   *
   * @returns {void}
   */
  _doInit () {
    if (this._initDone === false) {
      this._initDone = true;
      if (this.allowedFlags !== '') {
        const tmp = (this.notJs === false)
          ? this._cleanFlags(this.allowedFlags)
          : this.allowedFlags;
        const c = this._flagErrors.length

        if (c > 0) {
          for (let a = 0; a < c; a += 1) {
            // Log this to console to let the dev know they've
            // stuffed up
            console.error(this._flagErrors[a]);
          }
          // reset flag errors because these errros are only relevant
          // to the developer
          this._flagErrors = [];
        } else if (tmp.length > 0) {
          this.allowedFlags = tmp;
          this._customAllowedFlags = Array.from(tmp);
        }
      }
      // make sure the incoming flags are OK
      this.flags = this._cleanFlags(this.flags);

      let b = 0;
      this._placeFlag = '';
      for (let a = 0; a < this._customAllowedFlags.length; a += 1) {
        this._placeFlag += this._customAllowedFlags[a];
        b += 1;
        if (b >= 2) {
          break;
        }
      }
      this._flagSize = (this.flags !== '')
        ? this._getSize(this.flags, true)
        : this._getSize(this._placeFlag, true);

      if (this.value !== '') {
        // Test the incoming regex
        this._regexSize = this._getSize(this.value, false);
        this._regexIsValid(this.value, this.flags);
      }

      if (this.notJs === true && this.delim !== '' && this.delim !== '/') {
        const tmp = this.delim.trim().substring(0, 1);

        if (/^[\\a-z0-9 ]$/.test(tmp)) {
          console.error(`"${tmp}" is not a valid delimiter`)
        } else {
          if (this.pairedDelim === true) {
            switch (tmp) {
              case '{':
              case '}':
                this._delimOpen = '{';
                this._delimOpen = '}';
                break;

              case '(':
              case ')':
                this._delimOpen = '(';
                this._delimOpen = ')';
                break;

              case '[':
              case ']':
                this._delimOpen = '[';
                this._delimOpen = ']';
                break;

              case '<':
              case '>':
                this._delimOpen = '<';
                this._delimOpen = '>';
                break;

              default:
                this._delimOpen = tmp;
                this._delimClose = tmp;
            }
          } else {
            this._delimOpen = tmp;
            this._delimClose = tmp;
          }
        }
      } else {
        this.delim = '/';
        this._delimOpen = '/';
        this._delimClose = '/';
      }
    }
    this._setWholeRegex()
  }

  /**
   * Strip invalid flags and remove duplicate flags
   *
   * @param input Flags string
   *
   * @returns String without duplicate or invalid flags
   */
  _cleanFlags (input : string) : string {
    const tmp1 : Array<string> = Array.from(input)
    let tmp2 : Array<string> = [];
    let output : string = '';
    const errors : Array<string> = [];

    for (let a = 0; a < tmp1.length; a += 1) {
      if (this._customAllowedFlags.indexOf(tmp1[a]) > -1) {
        if (tmp2.indexOf(tmp1[a]) === -1) {
          tmp2.push(tmp1[a])
        } else {
          errors.push(`"${tmp1[a]}" was already listed so was removed`)
        }
      } else {
        errors.push(`"${tmp1[a]}" is not a valid flag so was removed`)
      }
    }

    this._flagErrors = errors;

    for (let a = 0; a < tmp2.length; a += 1) {
      output += tmp2[a];
    }
    return output;
  }

  /**
   * Get the length the input field should be (in REMs)
   *
   * @param str   The string defining the length of the input
   * @param flags Minimum value for output
   *
   * @returns Number of REMs wide the input field should be
   */
  _getSize (str : string, flags : boolean = false) : number {
    const tmp : number = this._chars2rems(str.length);

    if (str === '' && flags === true) {
      const _tmp : number = this._placeFlag.length
      return this._chars2rems((_tmp > 0) ? _tmp : 1);
    }

    if (tmp < 1) {
      return 1;
    } else {
      return tmp;
    }
  }

  /**
   * Build the full regex string including delimiters
   */
  _setWholeRegex () : void {
    this.wholeRegex = this._delimOpen + this.value +
                      this._delimClose + this.flags;
  }

  /**
   * Check whether the regex & flags are valid
   *
   * @param regexStr RegExp string
   * @param flagsStr Regexp modifier flags string
   *
   * @returns TRUE if regex is valid. FALSE otherwise
   */
  _regexIsValid (regexStr : string, flagsStr : string) : boolean {
    let regex : RegExp;

    try {
      regex = new RegExp(regexStr, flagsStr)
    } catch (e : any) {
      // Regex has an error lets deal with that
      this.hasError = true;
      this.regexError = this._ucFirst(e.message);

      return false;
    }
    // this.hasError = false;
    // this.regexError = '';

    // All good
    return true;
  }

  /**
   * Make first alphabetical character in a string uppercase
   *
   * @param input string to be modified
   *
   * @returns modified string
   */
  _ucFirst (input : string) : string {
    return input.replace(
      /^([^a-z]*)([a-z])/ig,
      (whole, first, char) => {
        return first + char.toUpperCase();
      }
    )
  }

  _chars2rems (input: number) {
    return Math.round((input * 0.675) * 100) / 100;
  }

  _escape (input : string) : string {
    return input.replace(/"/g, '&#34;')
  }

  //  END:  Private helper methods
  // --------------------------------------------
  // START: Event handler methods

  /**
   * Event handler for regex field key up events
   *
   * (Used for updating the width of the input field)
   *
   * @param event
   */
  regexKeyup (event : Event) : void {
    event.preventDefault()
    const input = event.target as HTMLInputElement;
    const tmp = this._getSize(input.value, false);

    if (tmp !== this._regexSize) {
      this._regexSize = tmp;
      this.requestUpdate();
    }
  }

  /**
   * Event handler function for regex field change events
   *
   * (Used for letting the outside world know the regex has changed
   * and is valid)
   *
   * @param event
   */
  regexChange (event : Event) : void {
    event.preventDefault()
    const input = event.target as HTMLInputElement;
    const tmp = input.value;

    if (tmp !== this.value) {
      // We have a new regex string to work with.
      if (tmp !== '') {
        if (!this._regexIsValid(tmp, this.flags)) {

          this.requestUpdate();
          return;
        }
      }
      this.value = tmp;

      // Regex is empty so cannot have an error
      this.hasError = false;
      this._setWholeRegex()
      if (this.regexError !== '') {
        // We no longer have an error message so we'd better update
        // the UI
        this.regexError = '';
        this.requestUpdate();
      }

      // Let the outside world know there's something new to work with.
      this.dispatchEvent(
        new Event('change', { bubbles: true, composed: true })
      );
    }
  }

  /**
   * Event handler function for flag field Key Up events
   * (used for adjusting the width)
   *
   * @param event
   */
  flagKeyup (event: Event) : void {
    event.preventDefault()

    const input = event.target as HTMLInputElement;
    const value = this._cleanFlags(input.value)
    const tmp = this._getSize(value, true);
    let doUpdate = false;

    if (tmp !== this._flagSize) {
      this._flagSize = tmp;
      doUpdate = true;
    }

    if (this._flagErrors.length > 0) {
      doUpdate = true;
    }

    if (input.value !== value) {
      input.value = value;
    }

    if (doUpdate === true) {
      this.requestUpdate();
    }
  }

  /**
   * Event handler function for regex flags change events
   *
   * (Used for letting the outside world know the regex has changed
   * and is valid)
   *
   * @param event
   */
  flagChange (event: Event) : void {
    event.preventDefault()

    const input = event.target as HTMLInputElement;
    const value = this._cleanFlags(input.value)

    if (this.flags !== value) {
      // Flags have actually changed so let the outside world know
      this.flags = value;
      this._setWholeRegex()

      this.dispatchEvent(
        new Event('change', { bubbles: true, composed: true })
      )
    }
  }

  //  END:  Private helper methods
  // --------------------------------------------
  // START: Public methods

  /**
   * Render the input field
   *
   * @returns {html}
   */
  render() {
    // console.group('render()')
    this._doInit();

    const regexClass = (this.regexError !== '')
      ? ' has-error'
      : ''

    const flagsClass = (this._flagErrors.length > 0)
      ? ' has-error'
      : ''

    const labelClass = (this.showLabels === true)
      ? 'sr-only'
      : '';

    const open = (!this.noFlags && !this.noDelims)
      ? html`<span class="delim">${this._delimOpen}</span>`
      : ''
    const close = (!this.noFlags && !this.noDelims)
      ? html`<span class="delim">${this._delimClose}</span>`
      : ''

    const allErrors = (this.regexError !== '')
      ? [this.regexError, ...this._flagErrors]
      : [...this._flagErrors]

    const errors = (allErrors.length > 1)
      ? html`
      <div class="errors">
        <strong>Errors:</strong>
        <ul>
          ${allErrors.map(error => html`<li>${error}</li>`)}
        </ul>
      </div>`
      : (allErrors.length === 1)
        ? html`
          <p class="errors">
            <strong>Error:</strong>
            ${allErrors[0]}
          </p>`
        : '';

    const flags = (this.noFlags === false)
      ? html`
        <label for="${this.labelID}_flags" class="${labelClass}">
          Flags
        </label>
        <input type="text"
               id="${this.labelID}_flags"
               name="${this.labelID}_flags"
               class="regex-flags${flagsClass}"
               .value="${this.flags}"
               placeholder="${this._placeFlag}"
               minlength="7"
               @keyup=${this.flagKeyup}
               @change=${this.flagChange}
               style="width: ${this._flagSize}rem"
               ?disabled=${this.disabled}
        />`
      : ''

    return html`
    <div class="whole">
      <div aria-live="assertive" role="alert">${errors}</div>
      <span class="wrap">
        ${open}
        <label for="${this.labelID}_regex" class="${labelClass}">
          Regular expression
        </label>
        <input type="text"
               id="${this.labelID}_regex"
               name="${this.labelID}_regex"
               class="regex-pattern${regexClass}"
               .value="${this._escape(this.value)}"
               placeholder=".*"
               minlength="${this.maxlength}"
               @change=${this.regexChange}
               @keyup=${this.regexKeyup}
               style="width: ${this._regexSize}rem"
               ?disabled=${this.disabled}
        />
        ${close}
        ${flags}
      </span>
    </div>`;
  }
}
