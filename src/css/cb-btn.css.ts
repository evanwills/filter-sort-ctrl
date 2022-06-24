import { css, CSSResult } from "lit";

export const cbBtn : CSSResult = css`
  .cb-btn__input {
    display: inline-block;
    position: absolute;
    opacity: 0;
    margin-right: -1rem;
    margin-bottom: -1rem;
  }
  .cb-btn__label {
    display: block;
    border: var(--line-weight-hvy) solid var(--text-colour);
    max-width: 24rem;
    padding: 0.2rem 1.75rem;
    position: relative;
    text-align: center;
    width: auto;
  }
  .cb-btn__label::before {
    border: var(--line-weight-hvy) solid var(--text-colour);
    border-radius: 50%;
    background-color: var(--text-colour);
    color: var(--bg-colour);
    content: var(--false-icon, "\u2717");;
    display: inline-block;
    // font-size: 0.86rem;
    font-weight: bold;
    height: 1em;
    left: 0.35rem;
    line-height: 0.9;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 1em;
    // text-indent: 0.05rem;
  }
  .cb-btn__input:checked + .cb-btn__label {
    background-color: var(--text-colour);
    color: var(--bg-colour);
  }
  .cb-btn__input:checked + .cb-btn__label::before {
    background-color: var(--bg-colour);
    border-color: var(--bg-colour);
    color: var(--text-colour);
    content: var(--true-icon, "\u2713");
    font-weight: normal;
    text-indent: 0;
  }
  .cb-btn__wrap {
    display: block;
  }`;
