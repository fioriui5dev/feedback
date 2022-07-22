sap.ui.define([], function() {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		currencyValue: function(sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},
		formatDate: function(odate) {
			var year = odate.substring(0, 4);
			var mont = odate.substring(4, 6);
			var day = odate.substring(6, 8);
			var Fdate = year.concat('-', mont, '-', day); //"2020-08-01";
			var date = new Date(Fdate);
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "d-MMM-y"
			});
			var fdateFormatted = dateFormat.format(date);
			return fdateFormatted;
		},
		formatTime: function(otime) {
			var h = otime.substring(0, 2);
			var m = otime.substring(2, 4);
			var s = otime.substring(4, 6);
			var Ftime = h.concat("-", m, "-", s); 
			return Ftime;
		}
	};

});