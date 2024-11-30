const unitTestingTask = require('./unitTestingTask');

describe('date formatting tokens', () => {
    const date = new Date(2022, 3, 5, 14, 30, 15, 123); // April 5, 2022, 14:30:15.123

    it('should format YYYY correctly', () => {
        expect(unitTestingTask('YYYY', date)).toBe('2022');
    });

    it('should format YY correctly', () => {
        expect(unitTestingTask('YY', date)).toBe('22');
    });

    it('should format MMMM correctly', () => {
        unitTestingTask.lang('en');
        expect(unitTestingTask('MMMM', date)).toBe('April');
    });

    it('should format MMM correctly', () => {
        unitTestingTask.lang('en');
        expect(unitTestingTask('MMM', date)).toBe('Apr');
    });

    it('should format MM correctly', () => {
        expect(unitTestingTask('MM', date)).toBe('04');
    });

    it('should format M correctly', () => {
        expect(unitTestingTask('M', date)).toBe('4');
    });

    it('should format DD correctly', () => {
        unitTestingTask.lang('en');
        expect(unitTestingTask('DDD', date)).toBe('Tuesday');
    });

    it('should format D correctly', () => {
        unitTestingTask.lang('en');
        expect(unitTestingTask('D', date)).toBe('Tu');
    });

    it('should format dd correctly', () => {
        expect(unitTestingTask('dd', date)).toBe('05');
    });

    it('should format d correctly', () => {
        expect(unitTestingTask('d', date)).toBe('5');
    });

    it('should format HH correctly', () => {
        expect(unitTestingTask('HH', date)).toBe('14');
    });

    it('should format H correctly', () => {
        expect(unitTestingTask('H', date)).toBe('14');
    });

    it('should format hh correctly', () => {
        expect(unitTestingTask('hh', date)).toBe('02');
    });

    it('should format h correctly', () => {
        expect(unitTestingTask('h', date)).toBe('2');
    });

    it('should format mm correctly', () => {
        expect(unitTestingTask('mm', date)).toBe('30');
    });

    it('should format m correctly', () => {
        expect(unitTestingTask('m', date)).toBe('30');
    });

    it('should format ss correctly', () => {
        expect(unitTestingTask('ss', date)).toBe('15');
    });

    it('should format s correctly', () => {
        expect(unitTestingTask('s', date)).toBe('15');
    });

    it('should format ff correctly', () => {
        expect(unitTestingTask('ff', date)).toBe('123');
    });

    it('should format f correctly', () => {
        expect(unitTestingTask('f', date)).toBe('123');
    });

    it('should format A correctly', () => {
        unitTestingTask.lang('en');
        expect(unitTestingTask('A', date)).toBe('PM');
    });

    it('should format a correctly', () => {
        unitTestingTask.lang('en');
        expect(unitTestingTask('a', date)).toBe('pm');
    });

    it('should format ZZ correctly', () => {
        expect(unitTestingTask('ZZ', date)).toMatch(/\+\d{2}[:-]\d{2}$/);
    });

    it('should format Z correctly', () => {
        expect(unitTestingTask('Z', date)).toMatch(/\+\d{2}(:-|:-|-\:|\-|\:)\d{2}$/);
    });
});

describe('custom formatters', () => {
    it('should register and use a custom formatter', () => {
        unitTestingTask.register('customFormat', 'YYYY/MM/dd HH:mm');
        const date = new Date(2022, 3, 5, 14, 30);
        expect(unitTestingTask('customFormat', date)).toBe('2022/04/05 14:30');
    });

    it('should list custom formatters', () => {
        const formatters = unitTestingTask.formatters();
        expect(formatters).toContain('customFormat');
    });
});

describe('language support', () => {
    it('should set and get the current language', () => {
        unitTestingTask.lang('en');
        expect(unitTestingTask.lang()).toBe('en');
    });

    it('should add and use a new language', () => {
        unitTestingTask.lang('cz', {
            _months: 'Leden_Únor_Březen_Duben_Květen_Červen_Červenec_Srpen_Září_Říjen_Listopad_Prosinec'.split('_'),
            months: function (date) {
                return this._months[date.getMonth()];
            },
            _monthsShort: 'Led_Úno_Bře_Dub_Kvě_Čer_Čer_Srp_Zář_Říj_Lis_Pro'.split('_'),
            monthsShort: function (date) {
                return this._monthsShort[date.getMonth()];
            },
            weekdays: 'Neděle_Pondělí_Úterý_Středa_Čtvrtek_Pátek_Sobota'.split('_'),
            weekdaysShort: 'Ne_Po_Út_St_Čt_Pá_So'.split('_'),
            weekdaysMin: 'Ne_Po_Út_St_Čt_Pá_So'.split('_'),
            meridiem : function (hours, isLower) {
                if (hours > 11) {
                    return isLower ? 'odp' : 'ODP';
                } else {
                    return isLower ? 'dop' : 'DOP';
                }
            }
        });

        unitTestingTask.lang('cz');
        const date = new Date(2022, 3, 5, 14, 30);
        expect(unitTestingTask('MMMM', date)).toBe('Duben');
        expect(unitTestingTask('a', date)).toBe('odp');
    });
});

describe('error handling', () => {
    beforeAll(() => {
        console.log('Before all comment 1');
    });

    beforeEach(() => {
        console.log('Before each comment 2');
    });

    it('should throw an error for invalid format argument', () => {
        expect(() => unitTestingTask(null)).toThrow(TypeError);
        console.log('test 1 completed');
    });

    it('should throw an error for invalid date argument', () => {
        expect(() => unitTestingTask('YYYY', {})).toThrow(TypeError);
        console.log('test 2 completed');
    });

    afterAll(() => {
        console.log('After all comment 1');
    });

    afterEach(() => {
        console.log('After each comment 2');
    });
});

describe('noConflict', () => {
    it('should restore previous unitTestingTask value', () => {
        const previousValue = global.unitTestingTask;
        global.unitTestingTask = 'someValue';
        const result = unitTestingTask.noConflict();
        expect(global.unitTestingTask).toBe('someValue');
        expect(result).toBe(unitTestingTask);
        global.unitTestingTask = previousValue;
    });
});
