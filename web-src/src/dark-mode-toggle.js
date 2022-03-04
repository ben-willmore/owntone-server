function setColorScheme() {
  const system_scheme = window.matchMedia("(prefers-color-scheme: dark)");
  const preferred_colorscheme = localStorage.getItem("preferred_colorscheme");
  const meta_tag = document.querySelector( 'meta[name="theme-color"]' );

  if (preferred_colorscheme === "dark" || (preferred_colorscheme === "system" && system_scheme.matches)) {
    document.documentElement.classList.add("dark-theme");
    meta_tag.setAttribute('content', '#000000');
  } else if (preferred_colorscheme == "light"|| (preferred_colorscheme === "system" && !system_scheme.matches)) {
    document.documentElement.classList.remove("dark-theme");
    meta_tag.setAttribute('content', '#ffffff');
  }
}

window.addEventListener('load', () => {
  // if preference is unset, set it to "system" by default
  if ( !localStorage.getItem('preferred_colorscheme') ) {
    localStorage.setItem('preferred_colorscheme', 'system')
  }

  setColorScheme();
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  setColorScheme();
});
