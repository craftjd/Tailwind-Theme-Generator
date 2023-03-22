import Vue from 'vue';
import chroma from 'chroma-js';

new Vue({
    el: '#app',

    created() {
        const savedTab = localStorage.getItem('activeTab');
        this.activeTab = savedTab ? savedTab : 'tailwind';

        this.isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    },

    data: {
        activeTab: 'tailwind',
        defaultBrandHex: '#6366f1',
        colorInputValue: '',
        percentInputValue: '0.4',
        grayPercentInputValue: '0.2',
        ctaHueInputValue: '150',
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
            { icon: 'fa-magic', title: 'Semantic harmony', description: 'Info, success, and danger tones inherit your brand DNA automatically.' },
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

    computed: {
        inputClass() {
            return this.isDarkMode
                ? 'bg-gray-800 border border-gray-600'
                : 'bg-white border border-gray-300';
        },

        brand() {
            return this.colorInputValue
                ? chroma(this.colorInputValue)
                : chroma(this.defaultBrandHex);
        },

        percent() {
            return this.percentInputValue;
        },

        grayPercent() {
            return this.grayPercentInputValue;
        },

        ctaHueShift() {
            return this.ctaHueInputValue;
        },

        tintOneShift() {
            return this.tintOneInputValue;
        },

        tintTwoShift() {
            return this.tintTwoInputValue;
        },

        shadeOneShift() {
            return this.shadeOneInputValue;
        },

        shadeTwoShift() {
            return this.shadeTwoInputValue;
        },

        previewHeaderBackground() {
            return this.isDarkMode
                ? this.shade(this.brand, this.shadeOneShift).hex()
                : this.colors.brand.value.hex();
        },

        previewBodyBackground() {
            return this.isDarkMode
                ? this.grays['gray-darkest'].value.hex()
                : this.grays['gray-lightest'].value.hex();
        },

        previewHeadingColor() {
            return this.isDarkMode
                ? this.tint(this.brand, this.tintTwoShift).hex()
                : this.colors.brand.value.hex();
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

        previewBorderColor() {
            return this.isDarkMode
                ? this.grays['gray-dark'].value.hex()
                : this.grays['gray-lighter'].value.hex();
        },

        previewChromeBackground() {
            return this.isDarkMode
                ? this.grays.black.value.hex()
                : this.grays['gray-lighter'].value.hex();
        },

        previewFooterBackground() {
            return this.isDarkMode
                ? this.grays.black.value.hex()
                : this.grays['gray-darker'].value.hex();
        },

        previewInfoAlertBackground() {
            return this.tint(this.colors.info.value, this.tintTwoShift).hex();
        },

        previewSuccessAlertBackground() {
            return this.tint(this.colors.success.value, this.tintTwoShift).hex();
        },

        previewHeroGradient() {
            return `linear-gradient(145deg, ${this.tint(this.brand, this.tintTwoShift).hex()} 0%, ${this.previewBodyBackground} 45%, ${this.tint(this.colors.cta.value, this.tintOneShift).hex()} 100%)`;
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
                    value: this.brand.set('hsl.h', +this.ctaHueShift),
                },
                info: {
                    name: 'Info',
                    value: chroma.mix('#3df', this.brand, this.percent, 'lab'),
                },
                warning: {
                    name: 'Warning',
                    value: chroma.mix('#fd0', this.brand, this.percent, 'lab'),
                },
                success: {
                    name: 'Success',
                    value: chroma.mix('#3e4', this.brand, this.percent, 'lab'),
                },
                danger: {
                    name: 'Danger',
                    value: chroma.mix('#f34', this.brand, this.percent, 'lab'),
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
            return chroma.random();
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
