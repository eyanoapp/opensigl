/* eslint-disable no-new */
/* eslint-disable no-undef */
/* eslint-disable func-names */
angular.module('opensigl.components').component('osLayout', {
  templateUrl : 'js/components/osigl/osLayout/osLayout.html',
  controller : OsLayoutController,
  transclude : true,
  bindings : {},
});

OsLayoutController.$inject = ['SessionService'];

function OsLayoutController(Session) {
  const $ctrl = this;

  $ctrl.getEnterpriseLogo = () => {
    return Session.enterprise && Session.enterprise.logo
      ? Session.enterprise.logo
      : 'assets/icon.png';
  };

  $ctrl.$onInit = function onInit() {

    // Sidebar Interaction
    const psSidebar = new PerfectScrollbar('#sidebarMenu', {
      suppressScrollX : true,
    });

    // 1. Append backdrop to body
    const backdrop = document.createElement('div');
    backdrop.className = 'main-backdrop';
    document.body.appendChild(backdrop);

    // 2. Enable tooltips everywhere
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
      new bootstrap.Tooltip(el);
    });

    // 3. Show sidebar in mobile
    document.getElementById('menuLink')?.addEventListener('click', e => {
      e.preventDefault();
      document.body.classList.toggle('sidebar-show');
    });

    // 4. Hide sidebar in mobile when clicking on the backdrop
    document.querySelector('.main-backdrop')?.addEventListener('click', () => {
      document.body.classList.remove('sidebar-show', 'sideright-show');
    });

    // 5. Toggle .nav-sidebar (when clicking .nav-label)
    document.querySelectorAll('.sidebar .nav-label').forEach(label => {
      label.addEventListener('click', e => {
        e.preventDefault();
        const target = label.nextElementSibling;
        if (target && target.classList.contains('nav-sidebar')) {
          target.style.display = (target.style.display === 'block') ? 'none' : 'block';
          // Optionally update scrollbar here
          psSidebar.update();
        }
      });
    });

    // 6. Toggle nav-sub menus inside .has-sub
    document.querySelectorAll('.sidebar .has-sub').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const currentItem = link.closest('.nav-item');
        const target = link.nextElementSibling;

        if (target && target.classList.contains('nav-sub')) {
          target.style.display = (target.style.display === 'block') ? 'none' : 'block';
          psSidebar.update();
        }

        // Close siblings
        const siblings = currentItem?.parentElement?.children || [];
        Array.from(siblings).forEach(sib => {
          if (sib !== currentItem) {
            const sub = sib.querySelector('.nav-sub');
            if (sub && sub.style.display === 'block') {
              sub.style.display = 'none';
            }
          }
        });
      });
    });

    // 7. Toggle footer menu
    document.getElementById('sidebarFooterMenu')?.addEventListener('click', function (e) {
      e.preventDefault();
      const sidebar = this.closest('.sidebar');
      sidebar?.classList.toggle('footer-menu-show');
    });

    // 8. Header mobile scroll effect
    function animateHead() {
      const header = document.querySelector('.main-mobile-header');
      if (!header) return;
      if (window.scrollY > 20) {
        header.classList.add('scroll');
      } else {
        header.classList.remove('scroll');
      }
    }
    window.addEventListener('scroll', animateHead);

    // 9. Close sidebar footer menu if clicking outside
    document.addEventListener('click', e => {
      if (!e.target.closest('.sidebar-footer')) {
        document.querySelector('.sidebar')?.classList.remove('footer-menu-show');
      }
    });
    document.addEventListener('touchstart', e => {
      if (!e.target.closest('.sidebar-footer')) {
        document.querySelector('.sidebar')?.classList.remove('footer-menu-show');
      }
    });

    // 10. Form search focus effects
    document.querySelectorAll('.form-search .form-control').forEach(input => {
      ['focus', 'blur'].forEach(event => {
        input.addEventListener(event, () => {
          input.parentElement?.classList.toggle('onfocus');
        });
      });
    });

    // 11. Show/hide sidebar
    document.getElementById('menuSidebar').addEventListener('click', (e) => {
      e.preventDefault();

      if (window.matchMedia('(min-width: 992px)').matches) {
        document.body.classList.toggle('sidebar-hide');
      } else {
        document.body.classList.toggle('sidebar-show');
      }
    });

    // 12. Show/hide sidebar
    document.getElementById('menuSidebarOffset').addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.toggle('sidebar-show');
    });

    // 1. Apply skin mode from localStorage
    const skinMode = localStorage.getItem('skin-mode');
    if (skinMode === 'dark') {
      document.documentElement.setAttribute('data-skin', 'dark');

      const skinModeLinks = document.querySelectorAll('#skinMode .nav-link');
      skinModeLinks.forEach(link => link.classList.remove('active'));
      skinModeLinks[skinModeLinks.length - 1]?.classList.add('active'); // last-child
    }

    // 2. Set skin mode on click
    document.querySelectorAll('#skinMode .nav-link').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();

        // Activate clicked link and deactivate siblings
        document.querySelectorAll('#skinMode .nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        const mode = this.textContent.trim().toLowerCase();
        if (mode === 'dark') {
          document.documentElement.setAttribute('data-skin', 'dark');
          localStorage.setItem('skin-mode', 'dark');
        } else {
          document.documentElement.setAttribute('data-skin', '');
          localStorage.removeItem('skin-mode');
        }
      });
    });

    // 3. Apply sidebar skin from localStorage
    const sidebarSkin = localStorage.getItem('sidebar-skin');
    const sidebar = document.querySelector('.sidebar');
    if (sidebarSkin) {
      sidebar.className = `sidebar sidebar-${sidebarSkin}`;

      const sidebarSkinLinks = document.querySelectorAll('#sidebarSkin .nav-link');
      sidebarSkinLinks.forEach(link => link.classList.remove('active'));

      if (sidebarSkin === 'prime') {
        sidebarSkinLinks[1]?.classList.add('active'); // 2nd child (index 1)
      } else {
        sidebarSkinLinks[sidebarSkinLinks.length - 1]?.classList.add('active');
      }
    }

    // 4. Set sidebar skin on click
    document.querySelectorAll('#sidebarSkin .nav-link').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();

        // Activate clicked link and deactivate siblings
        document.querySelectorAll('#sidebarSkin .nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        const skin = this.textContent.trim().toLowerCase();
        if (skin === 'default') {
          sidebar.className = 'sidebar';
          localStorage.removeItem('sidebar-skin');
        } else {
          sidebar.className = `sidebar sidebar-${skin}`;
          localStorage.setItem('sidebar-skin', skin);
        }
      });
    });

  };
}
