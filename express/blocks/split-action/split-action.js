/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { createTag, getIconElement } from '../../scripts/scripts.js';

function hide($block) {
  const body = document.querySelector('body');
  body.style.overflow = 'auto';
  const $blockWrapper = $block.parentNode;
  if ($blockWrapper.parentElement.classList.contains('split-action-container')) {
    $blockWrapper.parentElement.style.opacity = '0';
    $block.style.bottom = `-${$block.offsetHeight}px`;
    setTimeout(() => {
      $blockWrapper.parentElement.style.display = 'none';
    }, 200);
  }
}

function show($block) {
  const body = document.querySelector('body');
  body.style.overflow = 'hidden';
  const $blockWrapper = $block.parentNode;
  if ($blockWrapper.parentElement.classList.contains('split-action-container')) {
    $blockWrapper.parentElement.style.display = 'block';
    setTimeout(() => {
      $blockWrapper.parentElement.style.opacity = '1';
      $block.style.bottom = '0';
    }, 10);
  }
}

function initCTAListener($block, href) {
  const $buttons = document.querySelectorAll('.button');

  for (let i = 0; i < $buttons.length; i += 1) {
    if ($buttons[i].href === href && !$buttons[i].classList.contains('no-event')) {
      $buttons[i].addEventListener('click', (e) => {
        e.preventDefault();
        show($block);
      });
    }
  }
}

function initNotchDragAction($block) {
  let touchStart = 0;
  const $notch = $block.querySelector('.notch');

  $notch.addEventListener('touchstart', (e) => {
    $block.style.transition = 'none';
    touchStart = e.changedTouches[0].clientY;
  });

  $notch.addEventListener('touchmove', (e) => {
    $block.style.bottom = `-${e.changedTouches[0].clientY - touchStart}px`;
  });

  $notch.addEventListener('touchend', (e) => {
    $block.style.transition = 'bottom 0.2s';
    if (e.changedTouches[0].clientY - touchStart > 100) {
      $notch.click();
    } else {
      $block.style.bottom = '0';
    }
  });
}

export default function decorate($block) {
  const $buttonsWrapper = createTag('div', { class: 'buttons-wrapper' });
  const $blockBackground = createTag('div', { class: 'block-background' });
  const $underlay = createTag('a', { class: 'underlay' });
  const $notch = createTag('a', { class: 'notch' });
  const $notchPill = createTag('div', { class: 'notch-pill' });
  const $blockWrapper = $block.parentNode;

  let hrefHolder = '';

  $block.prepend(getIconElement('adobe-express-white'));

  Array.from($block.children).forEach((div) => {
    const anchor = div.querySelector('a');
    if (anchor) {
      $buttonsWrapper.append(anchor);
      div.remove();

      if (anchor.classList.contains('same-as-floating-button-CTA')) {
        anchor.classList.add('no-event');
        anchor.target = '_self';
        hrefHolder = anchor.href;
      }
    }

    if (div.querySelector('picture')) {
      $blockBackground.append(div.querySelector('picture'));
      div.remove();
    }
  });

  $notch.append($notchPill);
  $blockBackground.append($underlay);
  $blockWrapper.append($blockBackground);
  $block.append($notch, $buttonsWrapper);

  [$notch, $underlay].forEach((element) => {
    element.addEventListener('click', () => {
      hide($block);
    });
  });

  hide($block);

  if (window.innerWidth < 900) {
    initNotchDragAction($block);
    initCTAListener($block, hrefHolder);

    document.dispatchEvent(new Event('splitactionloaded'));
  }
}
