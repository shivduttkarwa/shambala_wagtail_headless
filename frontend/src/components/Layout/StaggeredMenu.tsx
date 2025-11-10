import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './StaggeredMenu.css';

interface SubMenuItem {
  label: string;
  link: string;
}

interface MenuItem {
  label: string;
  ariaLabel: string;
  link: string;
  subItems?: SubMenuItem[];
}

interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: MenuItem[];
  displayItemNumbering?: boolean;
  className?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  isFixed?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'left',
  colors = ['#B19EEF', '#5227FF'],
  items = [],
  displayItemNumbering = true,
  className,
  menuButtonColor = '#ffffff',
  openMenuButtonColor = '#fff',
  accentColor = '#5227FF',
  changeMenuColorOnOpen = true,
  isFixed = false,
  onMenuOpen,
  onMenuClose
}) => {
  const [open, setOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const openRef = useRef(false);
  const panelRef = useRef<HTMLElement>(null);
  const preLayersRef = useRef<HTMLDivElement>(null);
  const preLayerElsRef = useRef<Element[]>([]);
  const plusHRef = useRef<HTMLSpanElement>(null);
  const plusVRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const textInnerRef = useRef<HTMLSpanElement>(null);
  const textWrapRef = useRef<HTMLSpanElement>(null);
  const [textLines, setTextLines] = useState(['Menu', 'Close']);
  const submenuRefs = useRef<Map<number, HTMLUListElement>>(new Map());
  const submenuArrowRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const submenuTweens = useRef<Map<number, gsap.core.Timeline>>(new Map());
  const arrowTweens = useRef<Map<number, gsap.core.Tween>>(new Map());

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const busyRef = useRef(false);
  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;
      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers: Element[] = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      gsap.set(textInner, { yPercent: 0 });
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));

    const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
    const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

    if (itemEls.length) {
      gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    }
    if (numberEls.length) {
      gsap.set(numberEls, { '--sm-num-opacity': 0 });
    }

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });
    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;
    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: { each: 0.1, from: 'start' }
        },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: 'power2.out',
            '--sm-num-opacity': 1,
            stagger: { each: 0.08, from: 'start' }
          },
          itemsStart + 0.1
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();
    const offscreen = position === 'left' ? -100 : 100;
    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
        if (itemEls.length) {
          gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        }
        const numberEls = Array.from(panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item'));
        if (numberEls.length) {
          gsap.set(numberEls, { '--sm-num-opacity': 0 });
        }
        busyRef.current = false;
      }
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    if (!icon) return;
    spinTweenRef.current?.kill();
    if (opening) {
      spinTweenRef.current = gsap.to(icon, { rotate: 225, duration: 0.8, ease: 'power4.out', overwrite: 'auto' });
    } else {
      spinTweenRef.current = gsap.to(icon, { rotate: 0, duration: 0.35, ease: 'power3.inOut', overwrite: 'auto' });
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, {
          color: targetColor,
          delay: 0.18,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;
    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);
    setTextLines(seq);

    gsap.set(inner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }, []);

  const animateSubmenu = useCallback((index: number, isOpening: boolean) => {
    const arrow = submenuArrowRefs.current.get(index);
    
    submenuTweens.current.get(index)?.kill();
    arrowTweens.current.get(index)?.kill();

    if (isOpening) {
      // Animate arrow rotation
      if (arrow) {
        const arrowTween = gsap.to(arrow, {
          rotation: 45,
          duration: 0.3,
          ease: 'power2.out'
        });
        arrowTweens.current.set(index, arrowTween);
      }

      // Wait for next frame to get the submenu element after it's rendered
      requestAnimationFrame(() => {
        const submenu = submenuRefs.current.get(index);
        if (submenu) {
          gsap.set(submenu, { height: 'auto', opacity: 0, y: -10, scale: 0.95 });
          const naturalHeight = submenu.offsetHeight;
          gsap.set(submenu, { height: 0, scale: 1 });
          
          const submenuTween = gsap.timeline()
            .to(submenu, {
              height: naturalHeight,
              duration: 0.4,
              ease: 'power2.out'
            })
            .to(submenu, {
              opacity: 1,
              y: 0,
              duration: 0.3,
              ease: 'power1.out'
            }, '-=0.2');
          
          submenuTweens.current.set(index, submenuTween);
        }
      });
    } else {
      const submenu = submenuRefs.current.get(index);
      
      if (submenu) {
        const submenuTween = gsap.timeline()
          .to(submenu, {
            opacity: 0,
            y: -5,
            duration: 0.2,
            ease: 'power1.in'
          })
          .to(submenu, {
            height: 0,
            duration: 0.25,
            ease: 'power2.in'
          }, '-=0.1');
        
        submenuTweens.current.set(index, submenuTween);
      }

      if (arrow) {
        const arrowTween = gsap.to(arrow, {
          rotation: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        arrowTweens.current.set(index, arrowTween);
      }
    }
  }, []);

  const handleSubmenuToggle = useCallback((index: number) => {
    const isCurrentlyOpen = openSubmenu === index;
    const newOpenSubmenu = isCurrentlyOpen ? null : index;
    
    if (openSubmenu !== null && openSubmenu !== index) {
      animateSubmenu(openSubmenu, false);
    }
    
    if (!isCurrentlyOpen) {
      animateSubmenu(index, true);
    } else {
      animateSubmenu(index, false);
    }
    
    setOpenSubmenu(newOpenSubmenu);
  }, [openSubmenu, animateSubmenu]);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
      setOpenSubmenu(null);
    }
    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  return (
    <div
      className={(className ? className + ' ' : '') + 'staggered-menu-wrapper' + (isFixed ? ' fixed-wrapper' : '')}
      style={accentColor ? { ['--sm-accent' as string]: accentColor } : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
        {(() => {
          const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
          let arr = [...raw];
          if (arr.length >= 3) {
            const mid = Math.floor(arr.length / 2);
            arr.splice(mid, 1);
          }
          return arr.map((c, i) => <div key={i} className="sm-prelayer" style={{ background: c }} />);
        })()}
      </div>
      <header className="staggered-menu-header" aria-label="Main navigation header">
        <div className="sm-logo" aria-label="Logo">
          <span className="sm-logo-text">SHAMBALA HOMES</span>
        </div>
        <button
          ref={toggleBtnRef}
          className="sm-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={toggleMenu}
          type="button"
        >
          <span ref={textWrapRef} className="sm-toggle-textWrap" aria-hidden="true">
            <span ref={textInnerRef} className="sm-toggle-textInner">
              {textLines.map((l, i) => (
                <span className="sm-toggle-line" key={i}>
                  {l}
                </span>
              ))}
            </span>
          </span>
          <span ref={iconRef} className="sm-icon" aria-hidden="true">
            <span ref={plusHRef} className="sm-icon-line" />
            <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
          </span>
        </button>
      </header>

      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {items && items.length ? (
              items.map((it, idx) => (
                <li className="sm-panel-itemWrap" key={it.label + idx}>
                  {it.subItems && it.subItems.length > 0 ? (
                    <div className="sm-panel-item-with-submenu" data-index={idx + 1}>
                      <button
                        className="sm-panel-item sm-panel-item-button"
                        onClick={() => handleSubmenuToggle(idx)}
                        aria-label={it.ariaLabel}
                        aria-expanded={openSubmenu === idx}
                      >
                        <span className="sm-panel-itemLabel">
                          {it.label}
                          <span style={{ marginLeft: '2rem', fontSize: '1.2rem', fontWeight: 400, opacity: 0.7, color: 'rgba(250, 248, 243, 0.6)' }}>
                            {displayItemNumbering ? `0${idx + 1}` : ''}
                          </span>
                          <span 
                            ref={(el) => {
                              if (el) submenuArrowRefs.current.set(idx, el);
                            }}
                            className="sm-submenu-arrow"
                          >
                            +
                          </span>
                        </span>
                      </button>
                      <ul 
                        ref={(el) => {
                          if (el) submenuRefs.current.set(idx, el);
                        }}
                        className="sm-submenu" 
                        role="list"
                        style={{ 
                          overflow: 'hidden', 
                          height: openSubmenu === idx ? 'auto' : 0, 
                          opacity: openSubmenu === idx ? 1 : 0,
                          display: openSubmenu === idx ? 'flex' : 'none'
                        }}
                      >
                        {it.subItems.map((subItem, subIdx) => (
                          <li key={subItem.label + subIdx} className="sm-submenu-item">
                            <a href={subItem.link} className="sm-submenu-link">
                              {subItem.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <a className="sm-panel-item" href={it.link} aria-label={it.ariaLabel} data-index={idx + 1}>
                      <span className="sm-panel-itemLabel">{it.label}</span>
                    </a>
                  )}
                </li>
              ))
            ) : (
              <li className="sm-panel-itemWrap" aria-hidden="true">
                <span className="sm-panel-item">
                  <span className="sm-panel-itemLabel">No items</span>
                </span>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default StaggeredMenu;
