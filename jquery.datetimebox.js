(function ($) {

    $.fn.datetimebox = function (options) {

        var settings = $.extend({
            'type': 'date'
        }, options);

        var methods = {
            daysInMonth: function (month, year) {
                return 32 - new Date(year, month, 32).getDate();
            },

            zeroPad: function (nr, base) {
                base = base || 10;
                var len = (String(base).length - String(nr).length) + 1;
                return len > 0 ? new Array(len).join('0') + nr : nr;
            },

            updateDateTime: function (dateHiddenElement, dateYearElement, dateMonthElement, dateDayElement, dateTimeElement, newDate) {
                var currentDate = new Date();

                var newYear = newDate.getFullYear();
                var newMonth = newDate.getMonth() + 1;
                var newDay = newDate.getDate();

                var newHour = newDate.getHours();
                var newMinute = newDate.getMinutes();

                /*update hidden field */
                if (settings['type'] == 'datetime') {
                    dateHiddenElement.val(newYear + '-' + newMonth + '-' + newDay + ' ' + methods.zeroPad(newHour) + ':' + methods.zeroPad(newMinute));
                } else {
                    dateHiddenElement.val(newYear + '-' + newMonth + '-' + newDay);
                }

                if ($(dateYearElement).find('option').length == 0) {
                    for (year = currentDate.getFullYear(); year < currentDate.getFullYear() + 10; year++) {
                        var selected = '';
                        if (year == newYear) {
                            selected = 'selected="selected"';
                        }
                        dateYearElement.append('<option value="' + year + '" ' + selected + '>' + year + '</option>');
                    }
                }

                startMonth = 1;
                if (newYear == currentDate.getFullYear()) {
                    startMonth = currentDate.getMonth() + 1;
                }

                dateMonthElement.html('');
                for (month = startMonth; month <= 12; month++) {
                    var selected = '';
                    if (month == (newMonth)) {
                        selected = 'selected="selected"';
                    }
                    dateMonthElement.append('<option value="' + month + '" ' + selected + '>' + month + '</option>');
                }

                startDay = 1;
                if (newYear == currentDate.getFullYear() && newMonth == (currentDate.getMonth() + 1)) {
                    startDay = currentDate.getDate();
                }

                dateDayElement.html('');
                for (date = startDay; date <= methods.daysInMonth(newYear, newMonth); date++) {
                    var selected = '';
                    if (date == (newDay)) {
                        selected = 'selected="selected"';
                    }
                    dateDayElement.append('<option value="' + date + '" ' + selected + '>' + date + '</option>');
                }

                if (dateTimeElement != null) {
                    dateTimeElement.html('');
                    for (hour = 0; hour <= 23; hour++) {
                        for (minute = 0; minute < 60; minute = minute + 15) {

                            var selected = '';
                            if (hour == newHour && minute == newMinute) {
                                selected = 'selected="selected"';
                            }
                            dateTimeElement.append('<option value="' + methods.zeroPad(hour) + ':' + methods.zeroPad(minute) + '" ' + selected + '>' + methods.zeroPad(hour) + ':' + methods.zeroPad(minute) + '</option>');
                        }
                    }
                }
            }
        };

        return this.each(function () {

            var $this = $(this);

            var controlName = $this.attr('name');
            var controlValue = $this.attr('value');

            var container = $($this.parent());

            container.html('');

            container.append('<input type="hidden" id="' + controlName + '" name=' + controlName + ' value=' + controlValue + '/>');
            container.append('<select id="' + controlName + '-year"></select>');
            container.append('<select id="' + controlName + '-month"></select>');
            container.append('<select id="' + controlName + '-day"></select>');

            if (settings['type'] == 'datetime') {
                container.append('<select id="' + controlName + '-time"></select>');
            }

            var dateHiddenElement = container.find('#' + controlName);
            var dateYearElement = container.find('#' + controlName + '-year');
            var dateMonthElement = container.find('#' + controlName + '-month');
            var dateDayElement = container.find('#' + controlName + '-day');
            var dateTimeElement = null;
            
            if (settings['type'] == 'datetime') {
                dateTimeElement = container.find('#' + controlName + '-time');
            }

            methods.updateDateTime(dateHiddenElement, dateYearElement, dateMonthElement, dateDayElement, dateTimeElement, new Date());

            dateYearElement.change(function () {
                var year = dateYearElement.val();

                var month = 1;
                if (year == (new Date()).getFullYear()) {
                    month = (new Date()).getMonth() + 1;
                }

                var day = 1;

                methods.updateDateTime(dateHiddenElement, dateYearElement, dateMonthElement, dateDayElement, dateTimeElement, new Date(year, month - 1, day, 9, 0, 0));
            });

            dateMonthElement.change(function () {
                var year = dateYearElement.val();
                var month = dateMonthElement.val();
                var day = 1;

                methods.updateDateTime(dateHiddenElement, dateYearElement, dateMonthElement, dateDayElement, dateTimeElement, new Date(year, month - 1, day, 9, 0, 0));
            });
        });
    }
})(jQuery)