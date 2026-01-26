# Pin npm packages by running ./bin/importmap

pin 'application'
pin '@hotwired/turbo-rails', to: 'turbo.min.js'
pin '@hotwired/stimulus', to: 'https://ga.jspm.io/npm:@hotwired/stimulus@3.2.2/dist/stimulus.js'
pin '@hotwired/stimulus-loading', to: 'stimulus-loading.js'
pin_all_from 'app/javascript/controllers', under: 'controllers'
pin 'bootstrap', to: 'bootstrap.min.js', preload: true
pin '@popperjs/core', to: 'popper.js', preload: true
pin 'flatpickr', to: 'https://ga.jspm.io/npm:flatpickr@4.6.13/dist/esm/index.js'
pin 'mapbox-gl', to: 'https://ga.jspm.io/npm:mapbox-gl@3.1.2/dist/mapbox-gl.js'
pin 'process', to: 'https://ga.jspm.io/npm:@jspm/core@2.1.0/nodelibs/browser/process-production.js'
pin 'stimulus-flatpickr', to: 'https://ga.jspm.io/npm:stimulus-flatpickr@3.0.0-0/dist/index.m.js'
pin 'flatpickr/dist/l10n/ja.js', to: 'https://unpkg.com/flatpickr@4.6.13/dist/l10n/ja.js'
pin 'flatpickr/dist/l10n/ko.js', to: 'https://unpkg.com/flatpickr@4.6.13/dist/l10n/ko.js'
pin 'flatpickr/dist/l10n/zh.js', to: 'https://unpkg.com/flatpickr@4.6.13/dist/l10n/zh.js'
