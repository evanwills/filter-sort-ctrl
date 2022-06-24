import { css, CSSResult } from "lit";

export const radioList = (minWidth: number = 35) : CSSResult => {
  return css`
    .radio-list__wrap {
      align-content: stretch;
      align-items: stretch;
      border: var(--line-weight-hvy) solid var(--txt-colour);
      border-radius: var(--border-radius);
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: space-between;
      margin: 0.5em 0;
      overflow: hidden;
      padding: 0.1rem 0.3rem;
      position: relative;
    }
    .radio-list__wrap--short {
      display: inline-flex;
    }

    @media screen and (min-width: ${minWidth}rem) {
      .radio-list__wrap {
        /* border-radius: var(--border-radius); */
        flex-direction: row;
        padding: 0;
      }
    }

    .radio-list_item {
      box-sizing: border-box;
    }

    .radio-list {
      align-content: stretch;
      align-items: stretch;
      border: var(--line-weight-hvy) solid var(--txt-colour);
      border-radius: var(--border-radius);
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: space-between;
      margin: 0.5em 0;
      overflow: hidden;
      padding: 0.1rem 0.3rem;
      position: relative;
    }
    .radio-list--short {
      display: inline-flex;
    }

    .radio-list__wrap > li {
      // flex-grow: 1;
      list-style-type: none;
      margin: 0;
      padding: 0;
      // box-sizing: content-box;
    }
    .radio-list__label {
      /* background-color: var(--bg-colour); */
      /* color: var(--txt-colour); */
      border-radius: var(--border-radius);
      display: inline-block;
      /* height: 80%; */
      margin: 0 -0.25em;
      padding: 0.3rem 1.5em;
      position: relative;
      text-align: center;
      transition: color var(--ease) var(--timing) background-color var(--ease) var(--timing);
      width: calc(100% - .5rem);
    }
    .radio-list__label--short {
      padding: 0.3rem 2.5em;
      width: auto;
    }
    .radio-list__label--short.radio-list__label--checked {
      padding: 0.3rem 2.25rem 0.3rem 2.75rem;
    }
    .radio-list__label::after {
      background-color: var(--bg-colour);
      border: var(--line-weight-hvy) solid var(--bg-colour);
      border-radius: 50%;
      color: var(--txt-colour);
      content: "\\02713";
      display: inline-block;
      font-size: 0.86em;
      height: 1.25em;
      left: 0.35em;
      line-height: 1.25;
      opacity: 0;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      transition: opacity var(--ease) var(--timing);
      width: 1.25em;
    }
    li:first-child .radio-list__label::after {
      left: 0.45rem;
    }

    .radio-list :first-child .radio-list__label {
      margin-left: 0;
    }
    .radio-list :last-child .radio-list__label {
      margin-right: 0;
    }
    .radio-list__h {
      margin: 0;
    }
    .radio-list__input {
      display: inline-block;
      opacity: 0;
      height: 1px;
      width: 1px;
      margin-left: -1px;
      z-index: -1;
      position: absolute;
      top: -10em;
      left: -10em;
    }
    .radio-list__input:checked + .radio-list__label {
      color: var(--bg-colour);
      background-color: var(--txt-colour);
      z-index: 1;
    }
    .radio-list__input:checked + .radio-list__label::after {
      opacity: 1;
    }
  `;
}
