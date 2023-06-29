import Vue from 'vue';
import chroma from 'chroma-js';

new Vue({
    el: '#app',

    created() {
        const savedTab = localStorage.getItem('activeTab');
        this.activeTab = savedTab ? savedTab : 'tailwind';

        this.isDarkMode = localStorage.getItem('isDarkMode') === 'true';

        const savedHarmony = localStorage.getItem('harmonyMode');
        if (savedHarmony) {
            this.harmonyMode = savedHarmony;
        }
    },

    data: {
        activeTab: 'tailwind',
        defaultBrandHex: '#6366f1',
        colorInputValue: '',
        percentInputValue: '0.35',
        grayPercentInputValue: '0.2',
        harmonyMode: 'analogous',
        harmonyModes: [
            { id: 'monochromatic', label: 'Monochromatic', hint: 'Same hue — darker, richer CTA' },
            { id: 'analogous', label: 'Analogous', hint: 'Neighbouring hue (+30°)' },
            { id: 'triadic', label: 'Triadic', hint: 'Balanced accent (+120°)' },
            { id: 'complementary', label: 'Complementary', hint: 'Opposite hue (+180°)' },
            { id: 'split-complementary', label: 'Split complementary', hint: 'Split opposite (+150°)' },
            { id: 'achromatic', label: 'Achromatic', hint: 'Neutral gray from brand lightness' },
        ],
        tintOneInputValue: '.1',
        tintTwoInputValue: '.3',
        shadeOneInputValue: '.55',
        shadeTwoInputValue: '.3',
        isDarkMode: false,
        showAdvancedShifts: false,
        copied: false,
        tabs: [
            { id: 'tailwind', title: 'Tailwind' },
            { id: 'sass', title: 'SASS' },
            { id: 'scss', title: 'SCSS' },
        ],
        previewFeatures: [
            { icon: 'fa-magic', title: 'Semantic harmony', description: 'Status colors stay in recognizable UI ranges with subtle theme influence.' },
            { icon: 'fa-chart-line', title: 'Readable data viz', description: 'Charts and metrics stay legible in light and dark surfaces.' },
            { icon: 'fa-shield-alt', title: 'Accessible pairs', description: 'Text, borders, and fills are tuned for everyday UI density.' },
        ],
        previewMetrics: [
            { label: 'Contrast score', value: '94', meta: '+6 this week', positive: true, icon: 'fa-universal-access' },
            { label: 'Active tokens', value: '128', meta: 'All formats', positive: true, icon: 'fa-layer-group' },
            { label: 'Gray ramp', value: '10', meta: 'Brand-tinted', positive: true, icon: 'fa-adjust' },
            { label: 'Preview modes', value: '2', meta: 'Light & dark', positive: true, icon: 'fa-moon' },
        ],
        previewActivity: [
            { time: 'Just now', title: 'Brand base updated', detail: 'Primary swatch recalculated across semantic colors.', tone: 'brand' },
            { time: '4m ago', title: 'Gray ramp shifted', detail: 'Neutral surfaces picked up a subtle brand cast.', tone: 'info' },
            { time: '12m ago', title: 'Export ready', detail: 'Tailwind, SASS, and SCSS outputs are in sync.', tone: 'success' },
        ],
        previewDeployments: [
            { name: 'Marketing site', env: 'Production', status: 'success', progress: '100%' },
            { name: 'Design system', env: 'Staging', status: 'warning', progress: '68%' },
            { name: 'Mobile app', env: 'Review', status: 'brand', progress: 'Draft' },
        ],
        previewChartBars: [42, 68, 55, 84, 61, 92, 74],
    },

    watch: {
        harmonyMode(value) {
            localStorage.setItem('harmonyMode', value);
        },
    },

    computed: {
        inputClass() {
            return this.isDarkMode
                ? 'bg-gray-800 border border-gray-600'
                : 'bg-white border border-gray-300';
        },

        brand() {
            if (this.colorInputValue && chroma.valid(this.colorInputValue)) {
                return chroma(this.colorInputValue);
            }

            return chroma(this.defaultBrandHex);
        },

        themeInfluence() {
            const value = parseFloat(this.percentInputValue);

            if (isNaN(value)) {
                return 0.35;
            }

            return Math.min(Math.max(value, 0), 1);
        },

        grayPercent() {
            return this.grayPercentInputValue;
        },

        tintOneShift() {
            return this.shiftValue(this.tintOneInputValue, 0.1);
        },

        tintTwoShift() {
            return this.shiftValue(this.tintTwoInputValue, 0.3);
        },

        shadeOneShift() {
            return this.shiftValue(this.shadeOneInputValue, 0.55);
        },

        shadeTwoShift() {
            return this.shiftValue(this.shadeTwoInputValue, 0.3);
        },

        activeHarmonyMode() {
            return this.harmonyModes.find((mode) => mode.id === this.harmonyMode)
                || this.harmonyModes[1];
        },

        previewBodyBackground() {
            return this.isDarkMode
                ? this.grays['gray-darkest'].value.hex()
                : this.grays['gray-lightest'].value.hex();
        },

        previewHeadingColor() {
            return this.isDarkMode
                ? this.tint(this.brand, this.tintTwoShift).hex()
                : this.shade(this.brand, this.shadeOneShift).hex();
        },

        previewTextColor() {
            return this.isDarkMode
                ? this.grays['gray-light'].value.hex()
                : this.grays['gray-dark'].value.hex();
        },

        previewMutedTextColor() {
            return this.isDarkMode
                ? this.grays.gray.value.hex()
                : this.grays['gray-dark'].value.hex();
        },

        previewCardBackground() {
            return this.isDarkMode
                ? this.grays['gray-darker'].value.hex()
                : this.grays.white.value.hex();
        },

        previewDividerColor() {
            return this.isDarkMode
                ? this.grays['gray-darker'].value.hex()
                : this.grays['gray-lighter'].value.hex();
        },

        previewChromeBackground() {
            return this.isDarkMode
                ? this.grays.black.value.hex()
                : this.grays['gray-lighter'].value.hex();
        },

        previewBrandSurface() {
            return this.tint(this.brand, this.tintOneShift).hex();
        },

        previewBrandSurfaceMid() {
            return this.tint(this.brand, this.tintTwoShift).hex();
        },

        previewInfoAlertBackground() {
            return this.tint(this.colors.info.value, this.tintOneShift).hex();
        },

        previewCtaTextColor() {
            return this.contrastTextColor(this.colors.cta.value);
        },

        outputText() {
            const lines = [];

            if (this.activeTab === 'tailwind') {
                Object.keys(this.grays).forEach((id) => {
                    lines.push(`'${id}': '${this.grays[id].value.hex()}',`);
                });
                lines.push('');

                Object.keys(this.colors).forEach((id) => {
                    const color = this.colors[id].value;
                    lines.push(`'${id}-lighter': '${this.tint(color, this.tintOneShift).hex()}',`);
                    lines.push(`'${id}-light': '${this.tint(color, this.tintTwoShift).hex()}',`);
                    lines.push(`'${id}': '${color.hex()}',`);
                    lines.push(`'${id}-dark': '${this.shade(color, this.shadeOneShift).hex()}',`);
                    lines.push(`'${id}-darker': '${this.shade(color, this.shadeTwoShift).hex()}',`);
                    lines.push('');
                });
            }

            if (this.activeTab === 'sass') {
                Object.keys(this.grays).forEach((id) => {
                    lines.push(`$${id}: ${this.grays[id].value.hex()}`);
                });
                lines.push('');

                Object.keys(this.colors).forEach((id) => {
                    const color = this.colors[id].value;
                    lines.push(`$${id}-lighter: ${this.tint(color, this.tintOneShift).hex()}`);
                    lines.push(`$${id}-light: ${this.tint(color, this.tintTwoShift).hex()}`);
                    lines.push(`$${id}: ${color.hex()}`);
                    lines.push(`$${id}-dark: ${this.shade(color, this.shadeOneShift).hex()}`);
                    lines.push(`$${id}-darker: ${this.shade(color, this.shadeTwoShift).hex()}`);
                    lines.push('');
                });
            }

            if (this.activeTab === 'scss') {
                Object.keys(this.grays).forEach((id) => {
                    lines.push(`$${id}: ${this.grays[id].value.hex()};`);
                });
                lines.push('');

                Object.keys(this.colors).forEach((id) => {
                    const color = this.colors[id].value;
                    lines.push(`$${id}-lighter: ${this.tint(color, this.tintOneShift).hex()};`);
                    lines.push(`$${id}-light: ${this.tint(color, this.tintTwoShift).hex()};`);
                    lines.push(`$${id}: ${color.hex()};`);
                    lines.push(`$${id}-dark: ${this.shade(color, this.shadeOneShift).hex()};`);
                    lines.push(`$${id}-darker: ${this.shade(color, this.shadeTwoShift).hex()};`);
                    lines.push('');
                });
            }

            return lines.join('\n');
        },

        colors() {
            return {
                brand: {
                    name: 'Brand',
                    value: this.brand,
                },
                cta: {
                    name: 'CTA',
                    value: this.harmonyCtaColor(),
                },
                info: {
                    name: 'Info',
                    value: this.semanticColor('info'),
                },
                warning: {
                    name: 'Warning',
                    value: this.semanticColor('warning'),
                },
                success: {
                    name: 'Success',
                    value: this.semanticColor('success'),
                },
                danger: {
                    name: 'Danger',
                    value: this.semanticColor('danger'),
                },
            };
        },

        grays() {
            return {
                white: {
                    name: 'White',
                    value: chroma('#fff'),
                },
                'gray-lightest': {
                    name: 'gray Lightest',
                    value: chroma.mix('rgb(253, 253, 253)', this.brand, this.grayPercent, 'lab'),
                },
                'gray-lighter': {
                    name: 'gray Lighter',
                    value: chroma.mix('rgb(225, 225, 225)', this.brand, this.grayPercent, 'lab'),
                },
                'gray-light': {
                    name: 'gray Light',
                    value: chroma.mix('rgb(194, 194, 194)', this.brand, this.grayPercent, 'lab'),
                },
                gray: {
                    name: 'gray',
                    value: chroma.mix('rgb(163, 163, 163)', this.brand, this.grayPercent, 'lab'),
                },
                'gray-dark': {
                    name: 'gray Dark',
                    value: chroma.mix('rgb(133, 133, 133)', this.brand, this.grayPercent, 'lab'),
                },
                'gray-darker': {
                    name: 'gray Darker',
                    value: chroma.mix('rgb(96, 96, 96)', this.brand, this.grayPercent, 'lab'),
                },
                'gray-darkest': {
                    name: 'gray Darkest',
                    value: chroma.mix('rgb(60, 60, 60)', this.brand, this.grayPercent, 'lab'),
                },
                black: {
                    name: 'Black',
                    value: chroma.mix('rgb(30, 30, 30)', this.brand, this.grayPercent, 'lab'),
                },
            };
        },
    },

    methods: {
        setActiveTab(tab) {
            this.activeTab = tab;
            localStorage.setItem('activeTab', tab);
        },

        getRandomColor() {
            const hue = Math.floor(Math.random() * 360);

            return chroma.hsl(hue, 0.55, 0.5);
        },

        shiftValue(value, fallback) {
            const parsed = parseFloat(value);

            return isNaN(parsed) ? fallback : parsed;
        },

        contrastTextColor(background) {
            const color = typeof background === 'string' ? chroma(background) : chroma(background);

            return color.luminance() > 0.45
                ? this.shade(color, 0.55).hex()
                : '#ffffff';
        },

        normalizeHue(hue) {
            return ((hue % 360) + 360) % 360;
        },

        shortestHueDelta(from, to) {
            return ((to - from + 540) % 360) - 180;
        },

        clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        },

        semanticColor(role) {
            const bases = {
                info: { h: 205, s: 0.70, l: 0.48, hMin: 195, hMax: 215 },
                warning: { h: 38, s: 0.82, l: 0.50, hMin: 30, hMax: 46 },
                success: { h: 145, s: 0.58, l: 0.42, hMin: 136, hMax: 154 },
                danger: { h: 4, s: 0.70, l: 0.50, hMin: 350, hMax: 18 },
            };
            const base = bases[role];
            const influence = this.themeInfluence;
            const brandHue = this.brand.get('hsl.h');
            const brandSat = this.brand.get('hsl.s');
            const brandLight = this.brand.get('hsl.l');
            const maxHueShift = 10;

            let hueShift = this.shortestHueDelta(base.h, brandHue) * influence * 0.12;
            hueShift = this.clamp(hueShift, -maxHueShift, maxHueShift);
            let hue = this.normalizeHue(base.h + hueShift);

            if (role === 'danger') {
                if (hue > 18 && hue < 350) {
                    hue = hueShift >= 0 ? 18 : 350;
                }
            } else {
                hue = this.clamp(hue, base.hMin, base.hMax);
            }

            let sat = base.s * (1 - influence * 0.4) + brandSat * (influence * 0.4);
            sat = this.clamp(sat, base.s * 0.85, base.s * 1.08);

            let light = base.l * (1 - influence * 0.2) + brandLight * (influence * 0.2);
            light = this.clamp(light, 0.36, 0.56);

            return chroma.hsl(hue, sat, light);
        },

        harmonyCtaColor() {
            const hue = this.brand.get('hsl.h');
            const sat = this.brand.get('hsl.s');
            const light = this.brand.get('hsl.l');

            switch (this.harmonyMode) {
                case 'monochromatic':
                    return chroma.hsl(
                        hue,
                        this.clamp(sat * 1.1, 0.45, 0.88),
                        this.clamp(light - 0.1, 0.30, 0.52)
                    );
                case 'analogous':
                    return chroma.hsl(
                        this.normalizeHue(hue + 30),
                        this.clamp(sat * 1.02, 0.42, 0.78),
                        this.clamp(light - 0.05, 0.34, 0.54)
                    );
                case 'triadic':
                    return chroma.hsl(
                        this.normalizeHue(hue + 120),
                        this.clamp(sat * 0.95, 0.40, 0.72),
                        this.clamp(light - 0.03, 0.36, 0.54)
                    );
                case 'complementary':
                    return chroma.hsl(
                        this.normalizeHue(hue + 180),
                        this.clamp(sat * 0.92, 0.38, 0.70),
                        this.clamp(light - 0.03, 0.36, 0.54)
                    );
                case 'split-complementary':
                    return chroma.hsl(
                        this.normalizeHue(hue + 150),
                        this.clamp(sat * 0.94, 0.38, 0.72),
                        this.clamp(light - 0.03, 0.36, 0.54)
                    );
                case 'achromatic':
                    return chroma.hsl(
                        hue,
                        0,
                        this.clamp(light > 0.55 ? 0.26 : 0.20, 0.16, 0.32)
                    );
                default:
                    return chroma.hsl(
                        this.normalizeHue(hue + 30),
                        this.clamp(sat * 1.02, 0.42, 0.78),
                        this.clamp(light - 0.05, 0.34, 0.54)
                    );
            }
        },

        randomizeTheme() {
            this.colorInputValue = this.getRandomColor().hex();
        },

        tint(color, factor) {
            return chroma.mix('#fff', color, factor, 'lab');
        },

        shade(color, factor) {
            return chroma.mix('#000', color, factor, 'lab');
        },

        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode;
            localStorage.setItem('isDarkMode', this.isDarkMode);
        },

        previewStatusColor(status) {
            const colors = {
                success: this.colors.success.value,
                warning: this.colors.warning.value,
                danger: this.colors.danger.value,
                brand: this.colors.brand.value,
                info: this.colors.info.value,
            };

            return colors[status] ? colors[status].hex() : this.colors.info.value.hex();
        },

        previewToneSurface(color) {
            const value = typeof color === 'string' ? chroma(color) : color;

            return this.tint(value, this.tintOneShift).hex();
        },

        previewToneSurfaceMid(color) {
            const value = typeof color === 'string' ? chroma(color) : color;

            return this.tint(value, this.tintTwoShift).hex();
        },

        previewToneText(color) {
            const value = typeof color === 'string' ? chroma(color) : color;

            return this.shade(value, this.shadeOneShift).hex();
        },

        previewToneMuted(color) {
            const value = typeof color === 'string' ? chroma(color) : color;

            return this.shade(value, this.shadeTwoShift).hex();
        },

        previewDeploymentBadgeStyle(status) {
            const color = this.previewStatusColor(status);

            return {
                backgroundColor: this.previewToneSurfaceMid(color),
                color: this.previewToneText(color),
            };
        },

        copyOutput() {
            const text = this.outputText;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    this.showCopiedFeedback();
                });
                return;
            }

            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showCopiedFeedback();
        },

        showCopiedFeedback() {
            this.copied = true;

            if (this.copyFeedbackTimeout) {
                clearTimeout(this.copyFeedbackTimeout);
            }

            this.copyFeedbackTimeout = setTimeout(() => {
                this.copied = false;
            }, 2000);
        },
    },
});
