import { css, CSSResult } from 'lit';

import { srOnly } from './sr-only.css';
import { radioList } from './radio-list.css';
import { cbBtn } from './cb-btn.css';

export const style : CSSResult = css`
    :host {
      --bg-colour: #1b1b1b;
      --btn-padding-top: 1.3rem;
      --over-colour: rgba(0, 0, 0, 0.85);
      --over-colour--rev: rgba(255, 255, 255, 0.85);
      --text-colour: #fff;
      --trans-speed: 0.3s;
      --line-weight: 0.05rem;
      --line-weight-hvy: 0.1rem;
      --timing: 0.4s;
      --ease: ease-in-out;
      --border-radius: 1rem;
      --true-icon: "+";
      --false-icon: "\u2013";
    }
    ${srOnly}
    .wrap {
      background-color: var(--bg-colour);
      color: var(--text-colour);
      left: 50%;
      max-width: 35rem;
      opacity: 0;
      padding: 2rem;
      position: fixed;
      text-align: left;
      top: 50%;
      transform: scale(0) translate(-50%, -50%);
      transition: opacity ease-in-out var(--trans-speed) 0.15s,
                  height ease-in-out var(--trans-speed) 0.15s,
                  transform ease-in-out var(--trans-speed) 0.15s;
      transform-origin: 0 0;
      z-index: 100;
      width: calc(100% - 2rem);
    }
    button:hover {
      cursor: pointer;
    }
    h3 {
      margin: 0 0 0.5rem;
    }
    .wrap--show {
      opacity: 1;
      transform: scale(1) translate(-50%, -50%);
    }
    .bg-close {
      background-color: var(--over-colour);
      border-radius; 30rem;
      border: none;
      bottom: 0;
      height: 100%;
      left: 0;
      right: 0;
      opacity: 0;
      position: fixed;
      top: 0;
      transform: scale(0);
      transition: opacity ease-in-out var(--trans-speed),
                  transform ease-in-out var(--trans-speed);
      width: 100%;
      z-index: 99
    }
    .bg-close--show {
      opacity: 1;
      transform: scale(1);
      z-index: 99
    }
    .btn-open {
      background-color: transparent;
      border: none;
      color: var(--text-colour);
      display: inline-block;
      font-size: 1rem;
      font-weight: bold;
      padding: 0.75rem 2.5rem 0.75rem 2rem;
      position: relative;
      width: 100%;
    }
    ::slotted(*) {
      font-weight: bold;
    }
    .btn-open::before {
      content: '\u22EE';
      display: inline-block;
      font-size: 1.3rem;
      padding: 0.4rem 1rem;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-52%);
    }
    .btn-close {
      background-color: var(--text-colour);
      border-radius: 1rem;
      border: none;
      color: var(--bg-colour);
      display: inline-block;
      font-weight: bold;
      height: 1.5rem;
      line-height: 0.25rem;
      position: absolute;
      right: -0.5rem;
      top: -0.5rem;
      width: 1.5rem;
    }
    .btn-close::before {
      bottom: 0.05rem;
      content: '\u2717';
      position: relative;
    }
    .sort-btn {
      background-color: var(--text-colour);
      border: none;
      display: block;
      font-weight: bold;
      height: 1.25rem;
      justify-self: end;
      padding: 0.5rem;
      width: 1.5rem;
    }
    .sort-btn::before {
      content: ">";
      position: absolute;
      transform-origin: 100% 50%;
    }
    .ascending {
      align-self: end;
      border-bottom: 0.05rem solid var(--bg-colour);
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
      grid-area: sort-up;
      padding: 0.5rem 0.5rem 0.2rem 0.5rem;
    }
    .ascending::before {
      transform: rotate(-90deg) translate(140%, -75%) scaleY(1.75);
    }
    .decending {
      align-self: top;
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
      border-top: 0.05rem solid var(--bg-colour);
      grid-area: sort-down;
      padding: 0.5rem 0.5rem 0.2rem 0.5rem;
    }
    .decending::before {
      transform: rotate(90deg) translate(-35%, 59%) scaleY(1.75);
    }
    .fields {
      align-self: center;
      display: grid;
      grid-template-areas: 'fields sort-up'
                           'fields sort-down';
      grid-template-columns: 1fr 2.5rem;
      width: 100%;
    }
    .fields--help {
      grid-template-areas: 'fields  sort-up'
                           'fields sort-down'
                           ' help      .';
    }
    .fields .fields-list {
      grid-area: fields;
      list-style-type: none;
      padding: 0;
      margin: 0.5rem 0;
    }
    .fields li {
      margin-top: 0.5rem;
    }
    .filter-label {
      display: inline-block;
      width: 5rem;
    }
    input.filter-input[type=text] {
      display: inline-block;
      width: calc(100% - 6rem);
    }
    .help-block {
      font-weight: normal;
      grid-area: help;
    }
    code {
      background-color: var(--over-colour);
      border: 0.05rem solid var(--over-colour--rev);
      padding: 0.2rem 0.3rem;
    }
    ${radioList()}
    ${cbBtn}
  `;
