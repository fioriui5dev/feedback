/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 PONumSet in the list
// * All 3 PONumSet have at least one POCommSet

sap.ui.require([
	"sap/ui/test/Opa5",
	"feedback/POFeedack/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"feedback/POFeedack/test/integration/pages/App",
	"feedback/POFeedack/test/integration/pages/Browser",
	"feedback/POFeedack/test/integration/pages/Master",
	"feedback/POFeedack/test/integration/pages/Detail",
	"feedback/POFeedack/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "feedback.POFeedack.view."
	});

	sap.ui.require([
		"feedback/POFeedack/test/integration/MasterJourney",
		"feedback/POFeedack/test/integration/NavigationJourney",
		"feedback/POFeedack/test/integration/NotFoundJourney",
		"feedback/POFeedack/test/integration/BusyJourney",
		"feedback/POFeedack/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});