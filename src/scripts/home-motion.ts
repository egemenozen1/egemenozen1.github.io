import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function animateCards(section: Element) {
  const media = gsap.matchMedia();
  media.add('(min-width: 1001px) and (prefers-reduced-motion: no-preference)', () => {
    const cards = [...section.querySelectorAll<HTMLElement>('[data-pcard]')];
    cards.slice(0, -1).forEach((card, index) => {
      const scrollTrigger = { trigger: cards[index + 1], start: 'top bottom', end: 'top 20%', scrub: true } as const;
      const shade = card.querySelector('.dim');
      if (shade) gsap.to(shade, { opacity: 0.45, ease: 'none', scrollTrigger });
      gsap.to(card, { scale: 0.93, ease: 'none', scrollTrigger });
    });
  });
}

export function animateMarquee(track: HTMLElement, toggle: HTMLButtonElement) {
  const media = gsap.matchMedia();
  let userPaused = false;
  const updateLabel = () => { toggle.textContent = userPaused ? 'Resume toolkit' : 'Pause toolkit'; };
  media.add('(prefers-reduced-motion: no-preference)', () => {
    track.dataset.marqueeActive = '';
    updateLabel();
    toggle.hidden = false;
    const tween = gsap.to(track, { xPercent: -50, ease: 'none', duration: 40, repeat: -1, paused: true });
    let active = false;
    let speed: gsap.core.Tween | undefined;
    let settle: gsap.core.Tween | undefined;
    const stopSpeedTweens = () => { speed?.kill(); settle?.kill(); };
    const sync = () => {
      stopSpeedTweens();
      tween.paused(userPaused || !active || document.hidden);
    };
    const onClick = () => {
      userPaused = !userPaused;
      updateLabel();
      sync();
    };
    const trigger = ScrollTrigger.create({
      trigger: track, start: 'top bottom', end: 'bottom top',
      onToggle: (state) => { active = state.isActive; sync(); },
      onUpdate: (state) => {
        if (userPaused || !active || document.hidden) return;
        stopSpeedTweens();
        const direction = state.direction < 0 ? -1 : 1;
        const velocity = Math.min(4, 1 + Math.abs(state.getVelocity()) / 600);
        speed = gsap.to(tween, { timeScale: direction * velocity, duration: 0.3 });
        settle = gsap.to(tween, { timeScale: direction, duration: 1.2, delay: 0.3, immediateRender: false });
      },
    });
    active = trigger.isActive;
    sync();
    toggle.addEventListener('click', onClick);
    document.addEventListener('visibilitychange', sync);
    return () => {
      stopSpeedTweens();
      delete track.dataset.marqueeActive;
      toggle.hidden = true;
      toggle.removeEventListener('click', onClick);
      document.removeEventListener('visibilitychange', sync);
    };
  });
}
