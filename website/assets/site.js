const nav = document.getElementById('nav');
if (!nav.classList.contains('solid')) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
document.querySelector('.menu-btn')?.addEventListener('click', () => nav.classList.toggle('open'));
for (const link of document.querySelectorAll('.nav-links a'))
  link.addEventListener('click', () => nav.classList.remove('open'));

const copy = async (button, text) => {
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = 'Copied';
  } catch {
    button.textContent = 'Select & copy';
  }
  setTimeout(() => (button.textContent = 'Copy'), 1500);
};
for (const button of document.querySelectorAll('.cmd button')) {
  button.addEventListener('click', () => copy(button, button.previousElementSibling.textContent));
}
for (const pre of document.querySelectorAll('.doc pre')) {
  const button = document.createElement('button');
  button.className = 'copy-btn';
  button.type = 'button';
  button.textContent = 'Copy';
  button.addEventListener('click', () => {
    const text = [...pre.querySelector('code').childNodes]
      .filter((node) => !(node.nodeType === 1 && node.classList.contains('c')))
      .map((node) => node.textContent)
      .join('')
      .replace(/\n{2,}/g, '\n')
      .trim();
    copy(button, text);
  });
  pre.append(button);
}

for (const tabs of document.querySelectorAll('[role="tablist"]')) {
  const buttons = [...tabs.querySelectorAll('[role="tab"]')];
  for (const button of buttons) {
    button.addEventListener('click', () => {
      for (const other of buttons) {
        const selected = other === button;
        other.setAttribute('aria-selected', String(selected));
        document.getElementById(other.getAttribute('aria-controls')).hidden = !selected;
      }
    });
  }
}

const tocLinks = [...document.querySelectorAll('.toc a')];
if (tocLinks.length) {
  const byId = new Map(tocLinks.map((link) => [link.hash.slice(1), link]));
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of tocLinks) link.classList.toggle('active', link === byId.get(entry.target.id));
      }
    },
    { rootMargin: '-90px 0px -70% 0px' },
  );
  for (const id of byId.keys()) {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  }
}
