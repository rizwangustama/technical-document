import { defineNuxtPlugin } from '#app';
import { h } from 'vue';
import type { IconSet, IconProps } from 'vuetify';
import * as TablerIcons from '@tabler/icons-vue';

const tablerIconSet: IconSet = {
  component: (props: IconProps) => {
    const name = props.icon as string;
    let component: any = null;

    // Hapus prefix 'tabler-' jika ada, dan pastikan lowercase
    const cleanName = (name.startsWith('tabler-') ? name.slice(7) : name).toLowerCase();

    const componentName = 'Icon' + cleanName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    component = (TablerIcons as any)[componentName];

    // Jika tidak ditemukan sama sekali, fallback ke IconHelp
    if (!component) {
      component = TablerIcons.IconHelp;
    }

    return h(component, {
      size: props.size,
      class: props.class,
      'stroke-width': '1.75',
    });
  }
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('vuetify:before-create', ({ vuetifyOptions }) => {
    vuetifyOptions.icons = vuetifyOptions.icons || {};
    vuetifyOptions.icons.defaultSet = 'tabler';

    // Override bawaan MDI Vuetify ke Tabler
    vuetifyOptions.icons.aliases = {
      complete: 'tabler-check',
      cancel: 'tabler-x',
      close: 'tabler-x',
      delete: 'tabler-trash',
      clear: 'tabler-x',
      success: 'tabler-circle-check',
      info: 'tabler-info-circle',
      warning: 'tabler-alert-circle',
      error: 'tabler-alert-triangle',
      prev: 'tabler-chevron-left',
      next: 'tabler-chevron-right',
      checkboxOn: 'tabler-square-check',
      checkboxOff: 'tabler-square',
      checkboxIndeterminate: 'tabler-square-minus',
      delimiter: 'tabler-circle',
      sortAsc: 'tabler-arrow-up',
      sortDesc: 'tabler-arrow-down',
      expand: 'tabler-chevron-down',
      menu: 'tabler-menu-2',
      subgroup: 'tabler-caret-down',
      dropdown: 'tabler-chevron-down',
      radioOn: 'tabler-circle-dot',
      radioOff: 'tabler-circle',
      edit: 'tabler-pencil',
      ratingEmpty: 'tabler-star',
      ratingFull: 'tabler-star-filled',
      ratingHalf: 'tabler-star-half-filled',
      loading: 'tabler-loader',
      first: 'tabler-chevrons-left',
      last: 'tabler-chevrons-right',
      unfold: 'tabler-arrows-up-down',
      file: 'tabler-file',
      plus: 'tabler-plus',
      minus: 'tabler-minus',
    };

    vuetifyOptions.icons.sets = {
      ...vuetifyOptions.icons.sets,
      tabler: tablerIconSet
    };
  });
});
