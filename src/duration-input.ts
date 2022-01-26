import { html, css, LitElement, } from 'lit';
// import { repeat } from 'lit/directives/repeat';
import {customElement, property} from 'lit/decorators.js';

@customElement('duration-input')
export class DurationInput extends LitElement {
  @property()
  value = 1234;
  @property()
  label = 'set';

  static styles = css`
    :root {
      --di-font-size: 1rem;
      --di-border-radius: var(--border-radius, 0.75rem);
      --di-text-colour: var(--txt-colour, #fff);
      --di-bg-colour: var(--bg-colour, #1d1b1b;);
      --di-btn-bg-colour: var(--btn-colour, rgb(0, 85, 34));
      --di-border-radius: var(--border-radius, 0.75rem);

      background-color: var(--di-bg-colour, inherit);
      color:  var(--di-text-colour, inherit);
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
    .inputs {
      background-color: var(--di-bg-colour, #000);
      border: 0.05rem solid var(--di-text-colour);
      border-radius: var(--di-border-radius);
      overflow: hidden;
    }
    input {
      background-color: transparent;
      border: none;
      color: var(--di-text-colour, #fff);
      display-inline-block;
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.875rem;
      font-weight: bold;
      padding-left: 0.5rem;
      padding-right: 0;
      transform: translateY(-0.09rem);
      text-align: right;
      width: 6rem;
      display: inline-block;
    }
    select {
      background-color: transparent;
      border: none;
      color: var(--di-text-colour, #fff);
      padding-left: 0.2rem;
    }
    option {
      background-color: var(--text-colour);
      color: var(--bg-colour);
    }
    option::selection {
      background-color: var(--bg-colour);
      color: var(--text-colour);
    }
    button {
      border-radius: var(--di-border-radius);
      border: 0.05rem solid var(--di-btn-colour);
      padding: 0.1rem var(--di-border-radius);
      background-color: var(--di-btn-bg-colour, #2d2b2b);;
      color: var(--di-btn-colour, #fff);
      /* font-weight: bold; */
      text-transform: uppercase;
    }
  `;

  /**
   * List of duration unit names & values
   *
   * @var units
   */
  units = [
    { key: 'year', value: 31557600 }, // 365.25 days
    { key: 'month', value: 2629800 }, // 36.25 days / 12 months
    { key: 'week', value: 605800 }, // 7 days
    { key: 'day', value: 86400 }, // 24 hours
    { key: 'hour', value: 3600 }, // 60^2
    { key: 'minute', value: 60 },
    { key: 'second', value: 1 }
  ];

  /**
   * The value to be applied to the units to calculate the total number of seconds
   *
   * @var value
   */
  rawValue = 0;
  unitStr = 'seconds';
  unitVal = 1;

  s (input : number) : string {
    return (input !== 1) ? 's' : ''
  }

  setUnitValue () {
    for (let a = 0; a < this.units.length; a += 1) {
      if (this.value >= this.units[a].value) {
        this.rawValue = Math.round((this.value / this.units[a].value) * 100) / 100;
        this.unitStr = this.units[a].key
        this.unitVal = this.units[a].value
        break;
      }
    }
  }

  unitChange(event: Event) {
    event.preventDefault()
    const input = event.target as HTMLInputElement;

    for (let a = 0; a < this.units.length; a += 1) {
      if (parseFloat(input.value) == this.units[a].value) {
        this.unitStr = this.units[a].key;
        this.unitVal = this.units[a].value;
        break;
      }
    }
  }

  valueChange (event: Event) {
    event.preventDefault()
    const input = event.target as HTMLInputElement;
    this.rawValue = parseFloat(input.value);
  }

  saveChange (event: Event) {
    event.preventDefault()
    const seconds = Math.round(this.rawValue * this.unitVal);
    if (seconds !== this.value) {
      this.value = seconds;
      this.dispatchEvent(
        new Event( 'change', {bubbles: true, composed: true})
      );
    }
  }

  ucfirst(input : string) : string {
    return input.substring(0, 1).toUpperCase() + input.substring(1)
  }

  render() {
    this.setUnitValue()
    const s = this.s(this.rawValue)

    return html`
      <span class="inputs">
        <label for="duration-value" class="sr-only">Duration value</label><!--
        --><input id="duration-value" type="number" .value="${this.rawValue}" @change=${this.valueChange} /><!--

        --><label for="duration-unit" class="sr-only">Duration unit</label><!--
        --><select id="duration-unit" .value="${this.unitVal}" @change=${this.unitChange}>
          ${this.units.map(item => html`
            <option .value="${item.value}" ?selected="${(item.key === this.unitStr)}">
              ${this.ucfirst(item.key)}${s}
            </option>`
          )}
        </select>
      </span>

      <button @click=${this.saveChange}>${this.label}</button>
    `;
  }
}
