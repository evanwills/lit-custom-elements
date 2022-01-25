import { html, css, LitElement, } from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { isNumber } from './validate';

@customElement('numeric-input')
export class NumericInput extends LitElement {
  @property()
  value : number = 0;
  @property()
  type : string = 'percent';
  @property()
  fieldid : string = 'percent';
  @property()
  min : number = 0;
  @property()
  max : number = 100;
  @property()
  symbol : string = '$';

  static styles = css`
    :host {
      --ni-font-size: 1rem;
      --ni-border-radius: var(--border-radius, 0.75rem);
      --ni-text-colour: var(--txt-colour, #fff);
      --ni-bg-colour: var(--bg-colour, rgb(0, 85, 34));

      font-size: 1rem;
      background-color: var(--ni-bg-colour, inherit);
      color:  var(--ni-text-colour, inherit);
      font-family: inherit;
      font-size: inherit;
    }
    .wrap {
      display: inline-flex;
      border: var(--ni-line-weight, 0.05rem) solid var(--ni-text-colour, #ccc);
      border-radius: 0.75rem;
      overflow: hidden;
      padding: 0 0.4rem;
    }
    .wrap:focus-within {
      outline: 0.25rem dotted var(--ni-text-colour);
      outline-offset: 0.2rem;
    }
    .field__value {
      border: none;
      display: inline-block;
      font-family: 'Courier New', Courier, monospace;
      width: 6rem;
      background-color: transparent;
      color: var(--ni-text-colour);
      transform: translateY(0) !important;
    }
    .field__value:invalid {
      font-weight: bold;
      color: #c00;
    }
    .field__value--first {
      text-align: center;
    }
    .field__value--sm {
      width: 4.5rem !important;
    }
    .field__value:invalid + .field__unit--last {
      font-weight: bold;
      color: #c00;
    }
    .field__unit {
    }
    .field__unit--last {
      padding-left: 0.3rem;
    }
    .field__unit--first {
      padding-right: 0.2rem;
    }
  `;

  /**
   * The human readable value to be rendered
   *
   * @var humanValue
   */
  humanValue = 0;

  /**
   * Whether or not initialisation of functions and values is
   * alrady done
   *
   * @var initDone
   */
  initDone : boolean = false;

  /**
   * Numeric input step attribute value
   *
   * @var step
   */
  step : number = 0.0001;

  /**
   * Function used to convert human readable value into raw value to
   * be stored in the DB and used within the application
   *
   * @param {number} input
   * @returns {number}
   */
  getRaw : Function = (input : number) : number => { return input; };

  /**
   * Function to convert raw value (as stored in DB) to human
   * readable value
   *
   * @returns {void}
   */
  getHuman : Function = () : void => {  };

  /**
   * Regex pattern to be used as browser validation for user input
   *
   * (Derived from the set regex)
   *
   * @var pattern
   */
  pattern : string = '';

  /**
   * Pattern to validate user input
   *
   * @var regex
   */
  regex : RegExp = /^[0-9]{1,2}(?:\\.[0-9]{4})?$/;

  /**
   * Set the human readable dollar value for the input field
   *
   * @returns {void}
   */
  getHumanDollar () : void {
    this.humanValue = Math.round(this.value) / 100
  }

  /**
   * Set the human readable GST percent value for the input field
   *
   * @returns {void}
   */
  getHumanGst () {
    this.humanValue = Math.round(((1 / this.value) - 1) * 10000) / 100
  }

  /**
   * Set the human readable percent value for the input field
   *
   * @returns {void}
   */
  getHumanPercent () : void {
    this.humanValue = Math.round((1 - this.value) * 10000) / 100
  }

  /**
   * Get the raw dollar value for the input field to be stored
   *
   * @returns {number}
   */
  getRawDollar (input : number) : number {
    return Math.round(input * 100)
  }

  /**
   * Get the raw GST value for the input field to be stored
   *
   * @returns {number}
   */
  getRawGst (input : number) : number {
    return (100 / (100 + input))
  }

  /**
   * Get the raw percent value for the input field to be stored
   *
   * @returns {number}
   */
  getRawPercent (input : number) : number {
    return (1 - (input / 100))
  }

  /**
   * Do all the work to initialise everything
   *
   * @returns {void}
   */
  doInit () {
    if (this.initDone === false) {
      this.initDone = true;
      if (!isNumber(this.min)) {
        console.error('Attribute "min" is not a number - (' + this.min + ')');
      }
      if (!isNumber(this.max)) {
        console.error('Attribute "max" is not a number - (' + this.max + ')');
      }
      switch (this.type) {
        case 'dollar':
        case 'dollars':
        case 'money':
          this.type = 'dollar';
          this.getHuman = this.getHumanDollar;
          this.getRaw = this.getRawDollar;
          this.regex = /^[0-9]+(?:\\.[0-9]{2})?$/;
          this.step = 0.01;
          break
        case 'gst':
          this.getHuman = this.getHumanPercent;
          this.getRaw = this.getRawGst;
          break;

        case 'percent':
          this.getHuman = this.getHumanPercent;
          this.getRaw = this.getRawPercent;
          break;

        default:
          this.type = 'percent';
          this.getHuman = this.getHumanPercent;
          this.getRaw = this.getRawPercent;
          console.error('Could not determin appropriate type. Falling back to "percent"');
          break
      }
      this.pattern = this.regex.toString().replace(/^\/|\/$/g, '')
      this.getHuman()
    }
  }

  /**
   * Event handler function for change events
   *
   * @param event
   */
  valueChange (event: Event) : void {
    event.preventDefault()
    const input = event.target as HTMLInputElement;

    if (this.regex.test(input.value)) {
      this.humanValue = parseFloat(input.value);

      if (this.humanValue >= this.min && this.humanValue <= this.max) {
        const value = this.getRaw(this.humanValue)
        if (value !== this.value) {
          this.value = value;
          this.dispatchEvent(
            new Event('change', { bubbles: true, composed: true })
          )
        } else {
          console.info('Raw value is unchanged');
        }
      } else {
        console.error(input.value + ' is outside');
      }
    } else {
      console.error(input.value + ' is invalid');
    }
  }

  /**
   * Render the input field
   *
   * @returns {html}
   */
  render() {
    // console.group('render()')
    this.doInit();

    const modifier = (this.type !== 'dollar') ? ' field__value--first field__value--sm' : '';

    const input = html`<input type="number" id="${this.fieldid}" name="${this.fieldid}" class="field__value${modifier}" pattern="${this.pattern}" min="${this.min}" max="${this.max}" step="${this.step}" .value="${this.humanValue}" @change=${this.valueChange} />`;

    // console.log('this:', this)
    // console.log('this.fieldid:', this.fieldid)
    // console.log('modifier:', modifier)
    // console.log('input:', input)
    // console.groupEnd()
    if (this.type === 'dollar') {
      return html`
        <span class="wrap">
          <span class="field__unit field__unit--first">${this.symbol}</span>${input}
        </span>
      `;
    } else {
      return html`
        <span class="wrap">
          ${input}<span class="field__unit field__unit--last">%</span>
        </span>
      `;
    }
  }
}
